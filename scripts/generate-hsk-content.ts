/**
 * Generates HSK 2–6 course content (TypeScript data + Supabase migrations).
 *
 * Run: npm run db:generate-hsk
 *
 * Requires network on first run to download complete.min.json vocabulary source.
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import {
  ALL_HSK_UNIT_PLANS,
  MAX_LESSONS_PER_UNIT,
  WORDS_PER_LESSON,
  type HskUnitPlan,
} from "./hsk-unit-plans";
import { buildVocabPreviewTitle } from "../src/lib/lesson-titles";
import { vocabItems as existingVocab } from "../src/data/starter-hsk1/vocab";
import { units as existingUnits } from "../src/data/starter-hsk1/lessons";
import {
  buildLessonExercises,
  getLessonContext,
  type Band,
} from "../src/lib/lesson-generator";
import type { Lesson, Sentence, Unit, VocabItem } from "../src/types/course";
import type { BaseExercise } from "../src/types/exercises";

const COURSE_ID = "course-mandarin-1";
const VOCAB_CACHE = join(process.cwd(), "scripts/.cache/complete.min.json");
const GENERATED_DIR = join(process.cwd(), "src/data/generated");
const MIGRATIONS_DIR = join(process.cwd(), "supabase/migrations");

// --- Vocabulary source ---

interface RawHskWord {
  hanzi: string;
  pinyin: string;
  english: string;
  pos: string;
  hskLevel: number;
}

function ensureVocabCache(): void {
  if (existsSync(VOCAB_CACHE)) return;
  mkdirSync(join(process.cwd(), "scripts/.cache"), { recursive: true });
  console.log("Downloading HSK 3.0 vocabulary (complete.min.json)...");
  execSync(
    `curl -sL "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.min.json" -o "${VOCAB_CACHE}"`,
    { stdio: "inherit" }
  );
}

const POS_MAP: Record<string, string> = {
  V: "verb",
  N: "noun",
  A: "adjective",
  D: "adverb",
  P: "preposition",
  C: "conjunction",
  M: "measure",
  Q: "question",
  R: "pronoun",
  T: "time",
  U: "particle",
  O: "interjection",
  nr: "noun",
  ns: "noun",
  nt: "noun",
  nz: "noun",
  vn: "verb",
  an: "adjective",
};

function loadHskWords(level: number): RawHskWord[] {
  ensureVocabCache();
  const data = JSON.parse(readFileSync(VOCAB_CACHE, "utf8")) as Record<
    string,
    {
      s: string;
      l: string[];
      p?: string[];
      f: { i: { y: string }; m: string[] }[];
    }
  >;

  const tag = `n${level}`;
  const words: RawHskWord[] = [];

  for (const entry of Object.values(data)) {
    if (!entry.l?.includes(tag)) continue;
    const form = entry.f[0];
    if (!form) continue;
    const posCode = entry.p?.[0] ?? "N";
    words.push({
      hanzi: entry.s,
      pinyin: form.i.y,
      english: form.m[0] ?? entry.s,
      pos: POS_MAP[posCode] ?? "word",
      hskLevel: level,
    });
  }

  return words.sort((a, b) => a.hanzi.localeCompare(b.hanzi, "zh"));
}

// --- ID helpers ---

const hanziToExistingId = new Map(existingVocab.map((v) => [v.hanzi, v.id]));
const usedIds = new Set(existingVocab.map((v) => v.id));

function slugify(pinyin: string, hanzi: string): string {
  const base = pinyin
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || hanzi;
}

function makeVocabId(hskLevel: number, pinyin: string, hanzi: string): string {
  const existing = hanziToExistingId.get(hanzi);
  if (existing) return existing;

  let slug = slugify(pinyin, hanzi);
  let id = `v-h${hskLevel}-${slug}`;
  let n = 2;
  while (usedIds.has(id)) {
    id = `v-h${hskLevel}-${slug}-${n}`;
    n++;
  }
  usedIds.add(id);
  hanziToExistingId.set(hanzi, id);
  return id;
}

// --- Unit assignment ---

function maxWordsPerUnit(wordsPerLesson: number, includeReview: boolean): number {
  const contentLessons = includeReview ? MAX_LESSONS_PER_UNIT - 1 : MAX_LESSONS_PER_UNIT;
  return contentLessons * wordsPerLesson;
}

function partIndex(unitId: string): number {
  const match = unitId.match(/-p(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

/** Evenly spread vocabulary across content units (final units get words separately). */
function balanceWordsAcrossUnits(
  words: RawHskWord[],
  units: HskUnitPlan[]
): Map<string, RawHskWord[]> {
  const byUnit = new Map<string, RawHskWord[]>(units.map((u) => [u.id, []]));
  const contentUnits = units.filter((u) => !u.isFinal);

  if (contentUnits.length === 0) {
    words.forEach((word, i) => {
      const unit = units[i % units.length];
      byUnit.get(unit.id)!.push(word);
    });
    return byUnit;
  }

  words.forEach((word, i) => {
    const unit = contentUnits[i % contentUnits.length];
    byUnit.get(unit.id)!.push(word);
  });

  return byUnit;
}

/** Split any unit that would exceed MAX_LESSONS_PER_UNIT into themed parts. */
function expandOversizedUnits(
  units: HskUnitPlan[],
  wordsByUnit: Map<string, RawHskWord[]>,
  wordsPerLesson: number
): { units: HskUnitPlan[]; wordsByUnit: Map<string, RawHskWord[]> } {
  const expanded: HskUnitPlan[] = [];
  const expandedWords = new Map<string, RawHskWord[]>();

  for (const unit of units) {
    const words = wordsByUnit.get(unit.id) ?? [];
    const includeReview = !unit.isFinal && words.length > 0;
    const cap = maxWordsPerUnit(wordsPerLesson, includeReview);

    if (unit.isFinal || words.length <= cap) {
      expanded.push({ ...unit });
      expandedWords.set(unit.id, words);
      continue;
    }

    const partCount = Math.ceil(words.length / cap);
    for (let p = 0; p < partCount; p++) {
      const slice = words.slice(p * cap, (p + 1) * cap);
      const partId = `${unit.id}-p${p + 1}`;
      expanded.push({
        ...unit,
        id: partId,
        title: partCount > 1 ? `${unit.title} · ${p + 1}` : unit.title,
        isFinal: false,
      });
      expandedWords.set(partId, slice);
    }
  }

  const sorted = [...expanded].sort((a, b) => {
    if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
    return partIndex(a.id) - partIndex(b.id);
  });

  return { units: sorted, wordsByUnit: expandedWords };
}

function assignWordsToUnits(words: RawHskWord[], units: HskUnitPlan[]): Map<string, RawHskWord[]> {
  const balanced = balanceWordsAcrossUnits(words, units);
  const wordsPerLesson = WORDS_PER_LESSON[units[0]?.hskLevel ?? 2];
  const { units: expandedUnits, wordsByUnit } = expandOversizedUnits(
    units,
    balanced,
    wordsPerLesson
  );

  // Replace unit list in-place for downstream generation
  units.length = 0;
  units.push(...expandedUnits);

  return wordsByUnit;
}

// --- Lesson building ---

interface LessonDef {
  id: string;
  unitId: string;
  title: string;
  orderIndex: number;
  vocab: string[];
  isReview?: boolean;
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

function unitSlug(unitId: string): string {
  return unitId.replace(/^unit-/, "");
}

function lessonTitle(
  words: RawHskWord[],
  unitTitle: string,
  index: number,
  unit: HskUnitPlan,
  isLast: boolean,
  isReview: boolean
): string {
  if (isReview) return `${unitTitle} Review`;
  if (unit.isFinal && isLast) return `HSK ${unit.hskLevel} Graduation Exam`;
  if (unit.isFinal && !isReview) return `HSK ${unit.hskLevel} Review ${index + 1}`;
  return buildVocabPreviewTitle(words, `${unitTitle} ${index + 1}`);
}

function buildFinalUnitLessons(
  unit: HskUnitPlan,
  allLevelWords: RawHskWord[],
  hskLevel: number,
  wordsPerLesson: number
): LessonDef[] {
  const lessons: LessonDef[] = [];
  const reviewCount = Math.min(8, Math.max(2, Math.ceil(allLevelWords.length / (wordsPerLesson * 6))));
  const reviewWords = allLevelWords.filter((_, i) => i % Math.max(1, Math.floor(allLevelWords.length / (reviewCount * wordsPerLesson))) === 0);

  for (let i = 0; i < reviewCount; i++) {
    const start = (i * wordsPerLesson) % Math.max(1, reviewWords.length - wordsPerLesson + 1);
    const chunk = reviewWords.slice(start, start + wordsPerLesson);
    if (chunk.length === 0) continue;
    const vocabIds = chunk.map((w) => makeVocabId(hskLevel, w.pinyin, w.hanzi));
    lessons.push({
      id: `lesson-${unitSlug(unit.id)}-review-${i + 1}`,
      unitId: unit.id,
      title: `HSK ${hskLevel} Review ${i + 1}`,
      orderIndex: i + 1,
      vocab: vocabIds,
      isReview: true,
    });
  }

  const gradWords = allLevelWords.slice(-wordsPerLesson);
  const gradVocab = gradWords.map((w) => makeVocabId(hskLevel, w.pinyin, w.hanzi));
  lessons.push({
    id: `lesson-${unitSlug(unit.id)}-graduation`,
    unitId: unit.id,
    title: `HSK ${hskLevel} Graduation Exam`,
    orderIndex: lessons.length + 1,
    vocab: gradVocab,
  });

  return lessons;
}

function buildLessonsForLevel(
  hskLevel: number,
  units: HskUnitPlan[],
  wordsByUnit: Map<string, RawHskWord[]>,
  allLevelWords: RawHskWord[]
): { lessons: LessonDef[]; vocabItems: VocabItem[]; wordIdMap: Map<string, string> } {
  const lessons: LessonDef[] = [];
  const vocabItems: VocabItem[] = [];
  const wordIdMap = new Map<string, string>();
  const wordsPerLesson = WORDS_PER_LESSON[hskLevel];

  for (const unit of units) {
    const words = wordsByUnit.get(unit.id) ?? [];

    if (unit.isFinal) {
      const finalLessons = buildFinalUnitLessons(unit, allLevelWords, hskLevel, wordsPerLesson);
      for (const lesson of finalLessons) {
        for (const vocabId of lesson.vocab) {
          const word = allLevelWords.find((w) => makeVocabId(hskLevel, w.pinyin, w.hanzi) === vocabId);
          if (!word) continue;
          wordIdMap.set(`${word.hanzi}:${hskLevel}`, vocabId);
          if (!existingVocab.find((v) => v.id === vocabId) && !vocabItems.find((v) => v.id === vocabId)) {
            vocabItems.push({
              id: vocabId,
              courseId: COURSE_ID,
              hanzi: word.hanzi,
              pinyin: word.pinyin,
              english: word.english,
              partOfSpeech: word.pos,
              difficulty: hskLevel,
            });
          }
        }
      }
      lessons.push(...finalLessons);
      continue;
    }

    const chunks = chunk(words, wordsPerLesson);

    chunks.forEach((wordChunk, chunkIndex) => {
      const vocabIds = wordChunk.map((w) => {
        const id = makeVocabId(hskLevel, w.pinyin, w.hanzi);
        wordIdMap.set(`${w.hanzi}:${hskLevel}`, id);
        if (!existingVocab.find((v) => v.id === id) && !vocabItems.find((v) => v.id === id)) {
          vocabItems.push({
            id,
            courseId: COURSE_ID,
            hanzi: w.hanzi,
            pinyin: w.pinyin,
            english: w.english,
            partOfSpeech: w.pos,
            difficulty: hskLevel,
          });
        }
        return id;
      });

      const isLast = chunkIndex === chunks.length - 1;
      lessons.push({
        id: `lesson-${unitSlug(unit.id)}-${chunkIndex + 1}`,
        unitId: unit.id,
        title: lessonTitle(wordChunk, unit.title, chunkIndex, unit, isLast, false),
        orderIndex: chunkIndex + 1,
        vocab: vocabIds,
      });
    });

    if (!unit.isFinal && words.length > 0) {
      const reviewVocab = words
        .slice(0, Math.min(wordsPerLesson * 2, words.length))
        .map((w) => makeVocabId(hskLevel, w.pinyin, w.hanzi));
      lessons.push({
        id: `lesson-${unitSlug(unit.id)}-review`,
        unitId: unit.id,
        title: `${unit.title} Review`,
        orderIndex: chunks.length + 1,
        vocab: reviewVocab,
        isReview: true,
      });
    }
  }

  return { lessons, vocabItems, wordIdMap };
}

// --- Sentences ---

let sentenceCounter = 100;

function buildSentences(vocabItems: VocabItem[], hskLevel: number): Sentence[] {
  const sentences: Sentence[] = [];
  const sample = vocabItems.slice(0, Math.min(30, vocabItems.length));

  for (const v of sample) {
    sentenceCounter++;
    const id = `s-h${hskLevel}-${sentenceCounter}`;
    let hanzi: string;
    let pinyin: string;
    let english: string;

    if (v.partOfSpeech === "verb") {
      hanzi = `我会${v.hanzi}。`;
      pinyin = `Wǒ huì ${v.pinyin}.`;
      english = `I can ${v.english}.`;
    } else if (v.partOfSpeech === "adjective") {
      hanzi = `这个很${v.hanzi}。`;
      pinyin = `Zhège hěn ${v.pinyin}.`;
      english = `This is very ${v.english}.`;
    } else {
      hanzi = `这是${v.hanzi}。`;
      pinyin = `Zhè shì ${v.pinyin}.`;
      english = `This is ${v.english}.`;
    }

    sentences.push({
      id,
      courseId: COURSE_ID,
      hanzi,
      pinyin,
      english,
      difficulty: hskLevel,
    });
  }

  return sentences;
}

function bandForLevel(level: number): Band {
  return `hsk${level}` as Band;
}

function buildExercises(
  lessons: LessonDef[],
  allVocab: VocabItem[],
  allSentences: Sentence[],
  units: Unit[]
): BaseExercise[] {
  const vocabById = Object.fromEntries(allVocab.map((v) => [v.id, v]));
  const exercises: BaseExercise[] = [];

  for (const lesson of lessons) {
    const unit = units.find((u) => u.id === lesson.unitId)!;
    const unitLessons = lessons.filter((l) => l.unitId === lesson.unitId);
    // Use proper band for all HSK levels
    const ctx = getLessonContext(
      lesson.id,
      unit,
      lesson.orderIndex,
      unitLessons.length
    );

    const vocab = lesson.vocab.map((id) => vocabById[id]).filter(Boolean);
    const lessonSentences = allSentences.slice(0, 3);

    exercises.push(
      ...buildLessonExercises({
        lessonId: lesson.id,
        vocab,
        sentences: lessonSentences,
        ctx,
      })
    );
  }

  return exercises;
}

// --- SQL generation ---

function sqlStr(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlNullable(value: string | undefined | null): string {
  return value == null || value === "" ? "null" : sqlStr(value);
}

function sqlJson(value: unknown): string {
  return `${sqlStr(JSON.stringify(value))}::jsonb`;
}

function buildMigrationSql(
  hskLevel: number,
  units: Unit[],
  lessons: Lesson[],
  vocabItems: VocabItem[],
  sentences: Sentence[],
  lessonVocabMap: Record<string, string[]>,
  lessonSentenceMap: Record<string, string[]>,
  exercises: BaseExercise[]
): string {
  const unitPrefix = `unit-h${hskLevel}-`;
  const vocabPrefix = `v-h${hskLevel}-`;
  const sentencePrefix = `s-h${hskLevel}-`;

  const lines: string[] = [
    `-- HSK ${hskLevel} course content`,
    `-- Generated by npm run db:generate-hsk`,
    `-- Replaces any prior HSK ${hskLevel} units (including split parts).`,
    "",
    `-- Clear prior HSK ${hskLevel} content`,
    `update user_progress`,
    `  set current_lesson_id = 'lesson-sa-1'`,
    `  where current_lesson_id in (`,
    `    select id from lessons where unit_id like ${sqlStr(`${unitPrefix}%`)}`,
    `  );`,
    "",
    `delete from exercise_attempts`,
    `  where exercise_id in (`,
    `    select id from exercises where lesson_id in (`,
    `      select id from lessons where unit_id like ${sqlStr(`${unitPrefix}%`)}`,
    `    )`,
    `  );`,
    "",
    `delete from lesson_attempts`,
    `  where lesson_id in (select id from lessons where unit_id like ${sqlStr(`${unitPrefix}%`)});`,
    "",
    `delete from vocab_memory`,
    `  where vocab_item_id like ${sqlStr(`${vocabPrefix}%`)};`,
    "",
    `delete from exercises`,
    `  where lesson_id in (select id from lessons where unit_id like ${sqlStr(`${unitPrefix}%`)});`,
    "",
    `delete from lesson_vocab`,
    `  where lesson_id in (select id from lessons where unit_id like ${sqlStr(`${unitPrefix}%`)});`,
    "",
    `delete from lesson_sentences`,
    `  where lesson_id in (select id from lessons where unit_id like ${sqlStr(`${unitPrefix}%`)});`,
    "",
    `delete from lessons where unit_id like ${sqlStr(`${unitPrefix}%`)};`,
    "",
    `delete from units where id like ${sqlStr(`${unitPrefix}%`)};`,
    "",
    `delete from sentences where id like ${sqlStr(`${sentencePrefix}%`)};`,
    "",
    `delete from vocab_items where id like ${sqlStr(`${vocabPrefix}%`)};`,
    "",
    `insert into units (id, course_id, title, order_index) values`,
    units
      .map(
        (u) =>
          `  (${sqlStr(u.id)}, ${sqlStr(u.courseId)}, ${sqlStr(u.title)}, ${u.orderIndex})`
      )
      .join(",\n") + ";",
    "",
    `insert into lessons (id, unit_id, title, order_index) values`,
    lessons
      .map(
        (l) =>
          `  (${sqlStr(l.id)}, ${sqlStr(l.unitId)}, ${sqlStr(l.title)}, ${l.orderIndex})`
      )
      .join(",\n") + ";",
    "",
    `insert into vocab_items (id, course_id, hanzi, pinyin, english, part_of_speech, difficulty, image_url, emoji) values`,
    vocabItems
      .map(
        (item) =>
          `  (${sqlStr(item.id)}, ${sqlStr(item.courseId)}, ${sqlStr(item.hanzi)}, ${sqlStr(item.pinyin)}, ${sqlStr(item.english)}, ${sqlStr(item.partOfSpeech)}, ${item.difficulty}, null, null)`
      )
      .join(",\n") + ";",
    "",
    `insert into lesson_vocab (lesson_id, vocab_item_id) values`,
    Object.entries(lessonVocabMap)
      .flatMap(([lessonId, vocabIds]) =>
        vocabIds.map((vocabId) => `  (${sqlStr(lessonId)}, ${sqlStr(vocabId)})`)
      )
      .join(",\n") + ";",
  ];

  if (sentences.length > 0) {
    lines.push(
      "",
      `insert into sentences (id, course_id, hanzi, pinyin, english, difficulty, grammar_notes) values`,
      sentences
        .map(
          (s) =>
            `  (${sqlStr(s.id)}, ${sqlStr(s.courseId)}, ${sqlStr(s.hanzi)}, ${sqlStr(s.pinyin)}, ${sqlStr(s.english)}, ${s.difficulty}, null)`
        )
        .join(",\n") + ";"
    );
  }

  const lessonSentenceRows = Object.entries(lessonSentenceMap).flatMap(
    ([lessonId, sentenceIds]) =>
      sentenceIds.map((sid) => `  (${sqlStr(lessonId)}, ${sqlStr(sid)})`)
  );

  if (lessonSentenceRows.length > 0) {
    lines.push(
      "",
      `insert into lesson_sentences (lesson_id, sentence_id) values`,
      lessonSentenceRows.join(",\n") + ";"
    );
  }

  lines.push(
    "",
    `insert into exercises (id, lesson_id, type, prompt, payload_json, explanation, order_index) values`,
    exercises
      .map(
        (e) =>
          `  (${sqlStr(e.id)}, ${sqlStr(e.lessonId)}, ${sqlStr(e.type)}, ${sqlStr(e.prompt)}, ${sqlJson(e.payload)}, ${sqlNullable(e.explanation)}, ${e.orderIndex})`
      )
      .join(",\n") + ";",
    ""
  );

  return lines.join("\n");
}

function writeTsModule(
  hskLevel: number,
  units: Unit[],
  lessons: Lesson[],
  vocabItems: VocabItem[],
  sentences: Sentence[],
  lessonVocabMap: Record<string, string[]>,
  lessonSentenceMap: Record<string, string[]>
): void {
  const path = join(GENERATED_DIR, `hsk${hskLevel}.ts`);
  const content = `// Auto-generated by npm run db:generate-hsk — do not edit manually
import type { Lesson, Sentence, Unit, VocabItem } from "@/types/course";

export const hsk${hskLevel}Units: Unit[] = ${JSON.stringify(units, null, 2)};

export const hsk${hskLevel}Lessons: Lesson[] = ${JSON.stringify(lessons, null, 2)};

export const hsk${hskLevel}VocabItems: VocabItem[] = ${JSON.stringify(vocabItems, null, 2)};

export const hsk${hskLevel}Sentences: Sentence[] = ${JSON.stringify(sentences, null, 2)};

export const hsk${hskLevel}LessonVocabMap: Record<string, string[]> = ${JSON.stringify(lessonVocabMap, null, 2)};

export const hsk${hskLevel}LessonSentenceMap: Record<string, string[]> = ${JSON.stringify(lessonSentenceMap, null, 2)};

export const HSK${hskLevel}_LESSON_COUNT = ${lessons.length};
export const HSK${hskLevel}_VOCAB_COUNT = ${vocabItems.length};
`;
  writeFileSync(path, content, "utf8");
}

// --- Main ---

interface LevelOutput {
  hskLevel: number;
  units: Unit[];
  lessons: Lesson[];
  vocabItems: VocabItem[];
  sentences: Sentence[];
  lessonVocabMap: Record<string, string[]>;
  lessonSentenceMap: Record<string, string[]>;
  exercises: BaseExercise[];
}

function generateLevel(hskLevel: number, startOrderIndex: number): { output: LevelOutput; nextOrderIndex: number } {
  const unitPlans = ALL_HSK_UNIT_PLANS.filter((u) => u.hskLevel === hskLevel).map((u) => ({ ...u }));
  const rawWords = loadHskWords(hskLevel);
  const wordsByUnit = assignWordsToUnits(rawWords, unitPlans);
  console.log(`HSK ${hskLevel}: ${rawWords.length} words → ${unitPlans.length} units`);
  unitPlans.forEach((unit, index) => {
    unit.orderIndex = startOrderIndex + index;
  });

  const { lessons: lessonDefs, vocabItems: newVocab } = buildLessonsForLevel(
    hskLevel,
    unitPlans,
    wordsByUnit,
    rawWords
  );

  const units: Unit[] = unitPlans.map((u) => ({
    id: u.id,
    courseId: COURSE_ID,
    title: u.title,
    orderIndex: u.orderIndex,
  }));

  const lessons: Lesson[] = lessonDefs.map(({ id, unitId, title, orderIndex }) => ({
    id,
    unitId,
    title,
    orderIndex,
  }));

  const sentences = buildSentences(newVocab, hskLevel);
  const lessonVocabMap = Object.fromEntries(lessonDefs.map((l) => [l.id, l.vocab]));
  const lessonSentenceMap: Record<string, string[]> = {};
  for (const lesson of lessonDefs) {
    if (!lesson.isReview && sentences.length > 0) {
      const sid = sentences[lesson.orderIndex % sentences.length]?.id;
      if (sid) lessonSentenceMap[lesson.id] = [sid];
    }
  }

  const allVocab = [...existingVocab, ...newVocab];
  const exercises = buildExercises(lessonDefs, allVocab, sentences, units);

  return {
    output: {
      hskLevel,
      units,
      lessons,
      vocabItems: newVocab,
      sentences,
      lessonVocabMap,
      lessonSentenceMap,
      exercises,
    },
    nextOrderIndex: startOrderIndex + unitPlans.length,
  };
}

const MIGRATION_DATES: Record<number, string> = {
  2: "20260703000000",
  3: "20260704000000",
  4: "20260705000000",
  5: "20260706000000",
  6: "20260707000000",
};

mkdirSync(GENERATED_DIR, { recursive: true });
mkdirSync(MIGRATIONS_DIR, { recursive: true });

const allOutputs: LevelOutput[] = [];
let nextOrderIndex =
  Math.max(...existingUnits.map((u) => u.orderIndex), 0) + 1;

for (const level of [2, 3, 4, 5, 6] as const) {
  const { output, nextOrderIndex: next } = generateLevel(level, nextOrderIndex);
  nextOrderIndex = next;
  allOutputs.push(output);

  writeTsModule(
    level,
    output.units,
    output.lessons,
    output.vocabItems,
    output.sentences,
    output.lessonVocabMap,
    output.lessonSentenceMap
  );

  const migrationSql = buildMigrationSql(
    level,
    output.units,
    output.lessons,
    output.vocabItems,
    output.sentences,
    output.lessonVocabMap,
    output.lessonSentenceMap,
    output.exercises
  );

  const migrationPath = join(MIGRATIONS_DIR, `${MIGRATION_DATES[level]}_hsk${level}.sql`);
  writeFileSync(migrationPath, migrationSql, "utf8");

  console.log(
    `  → ${output.lessons.length} lessons, ${output.vocabItems.length} new vocab, ${output.exercises.length} exercises`
  );
  console.log(`  → wrote ${migrationPath}`);
}

// Write aggregate index
const aggregateContent = `// Auto-generated by npm run db:generate-hsk — do not edit manually
${[2, 3, 4, 5, 6].map((l) => `import * as hsk${l} from "./hsk${l}";`).join("\n")}

export {
${[2, 3, 4, 5, 6].map((l) => `  hsk${l},`).join("\n")}
};

export const hskAdvancedUnits = [
${[2, 3, 4, 5, 6].map((l) => `  ...hsk${l}.hsk${l}Units,`).join("\n")}
];

export const hskAdvancedLessons = [
${[2, 3, 4, 5, 6].map((l) => `  ...hsk${l}.hsk${l}Lessons,`).join("\n")}
];

export const hskAdvancedVocabItems = [
${[2, 3, 4, 5, 6].map((l) => `  ...hsk${l}.hsk${l}VocabItems,`).join("\n")}
];

export const hskAdvancedSentences = [
${[2, 3, 4, 5, 6].map((l) => `  ...hsk${l}.hsk${l}Sentences,`).join("\n")}
];

export const hskAdvancedLessonVocabMap: Record<string, string[]> = {
${[2, 3, 4, 5, 6].map((l) => `  ...hsk${l}.hsk${l}LessonVocabMap,`).join("\n")}
};

export const hskAdvancedLessonSentenceMap: Record<string, string[]> = {
${[2, 3, 4, 5, 6].map((l) => `  ...hsk${l}.hsk${l}LessonSentenceMap,`).join("\n")}
};

export const HSK_ADVANCED_LESSON_COUNT = ${allOutputs.reduce((s, o) => s + o.lessons.length, 0)};
export const HSK_ADVANCED_VOCAB_COUNT = ${allOutputs.reduce((s, o) => s + o.vocabItems.length, 0)};
`;

writeFileSync(join(GENERATED_DIR, "hsk-advanced.ts"), aggregateContent, "utf8");

console.log("\nDone! Totals:");
console.log(`  Lessons: ${allOutputs.reduce((s, o) => s + o.lessons.length, 0)}`);
console.log(`  New vocab: ${allOutputs.reduce((s, o) => s + o.vocabItems.length, 0)}`);
console.log(`  Exercises: ${allOutputs.reduce((s, o) => s + o.exercises.length, 0)}`);
