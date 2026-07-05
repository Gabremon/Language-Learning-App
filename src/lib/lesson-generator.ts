import type { Sentence, Unit, VocabItem } from "@/types/course";
import type { BaseExercise, ExerciseType } from "@/types/exercises";
import { englishWithoutToneLabel, extractToneFromEnglish, isToneDrillVocab } from "@/lib/tone-vocab";
import { getSyllableTone } from "@/lib/pinyin";
import {
  buildEnglishDistractors,
  buildHanziDistractors,
  getStarterLessonIndex,
} from "@/lib/starter-distractors";
import { seededShuffle } from "@/lib/seeded-shuffle";
import {
  getStarterDialoguesForLesson,
  getStarterYesNoForLesson,
} from "@/data/starter-hsk1/starter-scenarios";

/** HSK band derived from unit order (PDF curriculum architecture). */
export type Band = "starter" | "hsk1" | "hsk2" | "hsk3" | "hsk4" | "hsk5" | "hsk6";

export type LessonPhase =
  | "preview"
  | "input"
  | "guided"
  | "productive"
  | "memory"
  | "exit";

export interface ExerciseMix {
  multiple_choice: number;
  hanzi_to_english: number;
  pinyin_recognition: number;
  reverse_pinyin: number;
  listening: number;
  english_to_hanzi_word_bank: number;
  match_pairs: number;
  fill_in_blank: number;
  dialogue_response: number;
  yes_no_question: number;
  sentence_comprehension: number;
}

export interface LessonContext {
  lessonId: string;
  unitId: string;
  unitOrderIndex: number;
  lessonOrderIndex: number;
  lessonsInUnit: number;
  band: Band;
}

export function getBandForUnitId(unitId: string): Band {
  if (unitId.startsWith("unit-s")) return "starter";
  if (unitId.startsWith("unit-h1")) return "hsk1";
  if (unitId.startsWith("unit-h2") || unitId.startsWith("unit-dl")) return "hsk2";
  if (unitId.startsWith("unit-h3") || unitId.startsWith("unit-c")) return "hsk3";
  if (unitId.startsWith("unit-h4") || unitId.startsWith("unit-i")) return "hsk4";
  if (unitId.startsWith("unit-h5")) return "hsk5";
  if (unitId.startsWith("unit-h6")) return "hsk6";
  return "hsk4";
}

/** @deprecated Use getBandForUnitId — order-based lookup for legacy units only */
export function getBandForUnit(unitOrderIndex: number): Band {
  const legacy: Record<number, Band> = {
    1: "starter",
    2: "starter",
    3: "hsk1",
    4: "hsk1",
    5: "hsk1",
    6: "hsk1",
  };
  return legacy[unitOrderIndex] ?? "hsk1";
}

export function getLessonContext(
  lessonId: string,
  unit: Unit,
  lessonOrderIndex: number,
  lessonsInUnit: number
): LessonContext {
  return {
    lessonId,
    unitId: unit.id,
    unitOrderIndex: unit.orderIndex,
    lessonOrderIndex,
    lessonsInUnit,
    band: getBandForUnitId(unit.id),
  };
}

/** Target exercise count per band (PDF: Starter 18–22, HSK1 20–22, etc.). */
export function getTargetExerciseCount(band: Band, lessonOrderIndex: number): number {
  const base: Record<Band, number> = {
    starter: 22,
    hsk1: 20,
    hsk2: 22,
    hsk3: 24,
    hsk4: 26,
    hsk5: 28,
    hsk6: 30,
  };
  const ramp = Math.min(lessonOrderIndex - 1, 3);
  return base[band] + ramp;
}

/**
 * Exercise mix shifts from recognition-heavy (early) to production-heavy (late).
 * Example at HSK1 mid-unit: ~5 MC + ~5 short answer + listening + pinyin drills.
 */
export function getExerciseMix(ctx: LessonContext): ExerciseMix {
  const { band, lessonOrderIndex, lessonsInUnit } = ctx;
  const progress = (lessonOrderIndex - 1) / Math.max(lessonsInUnit - 1, 1);

  if (band === "starter") {
    const starterIndex = getStarterLessonIndex(ctx.lessonId);
    const isEarlySounds = starterIndex >= 0 && starterIndex < 4;
    if (isEarlySounds) {
      return {
        multiple_choice: 3,
        listening: 3,
        pinyin_recognition: 5,
        reverse_pinyin: 2,
        hanzi_to_english: 1,
        english_to_hanzi_word_bank: 0,
        match_pairs: 1,
        fill_in_blank: 0,
        dialogue_response: 0,
        yes_no_question: 0,
        sentence_comprehension: 0,
      };
    }
    return {
      multiple_choice: 2,
      listening: 2,
      pinyin_recognition: 2,
      reverse_pinyin: 1,
      hanzi_to_english: 1,
      english_to_hanzi_word_bank: 0,
      match_pairs: 1,
      fill_in_blank: 2,
      dialogue_response: 2,
      yes_no_question: 2,
      sentence_comprehension: 2,
    };
  }

  if (band === "hsk1") {
    const mc = progress < 0.5 ? 5 : 4;
    const typed = progress < 0.5 ? 3 : 5;
    return {
      multiple_choice: mc,
      hanzi_to_english: typed,
      pinyin_recognition: 3,
      reverse_pinyin: 2,
      listening: 3,
      english_to_hanzi_word_bank: progress > 0.3 ? 2 : 1,
      match_pairs: 1,
      fill_in_blank: progress > 0.5 ? 1 : 0,
      dialogue_response: 0,
      yes_no_question: 0,
      sentence_comprehension: 0,
    };
  }

  if (band === "hsk2") {
    return {
      multiple_choice: 4,
      hanzi_to_english: 5,
      pinyin_recognition: 2,
      reverse_pinyin: 2,
      listening: 3,
      english_to_hanzi_word_bank: 3,
      match_pairs: 1,
      fill_in_blank: 2,
      dialogue_response: 0,
      yes_no_question: 0,
      sentence_comprehension: 0,
    };
  }

  if (band === "hsk3") {
    return {
      multiple_choice: 3,
      hanzi_to_english: 6,
      pinyin_recognition: 2,
      reverse_pinyin: 2,
      listening: 3,
      english_to_hanzi_word_bank: 4,
      match_pairs: 1,
      fill_in_blank: 3,
      dialogue_response: 0,
      yes_no_question: 0,
      sentence_comprehension: 0,
    };
  }

  // hsk4, hsk5, hsk6 — production-heavy
  return {
    multiple_choice: 3,
    hanzi_to_english: 7,
    pinyin_recognition: 2,
    reverse_pinyin: 2,
    listening: 3,
    english_to_hanzi_word_bank: 4,
    match_pairs: 1,
    fill_in_blank: 3,
    dialogue_response: 0,
    yes_no_question: 0,
    sentence_comprehension: 0,
  };
}

/** Maps exercise types to lesson phases (PDF lesson sequence). */
export const PHASE_FOR_TYPE: Record<ExerciseType, LessonPhase> = {
  listening: "preview",
  multiple_choice: "guided",
  pinyin_recognition: "input",
  reverse_pinyin: "memory",
  hanzi_to_english: "productive",
  tone_and_english: "productive",
  english_to_hanzi_word_bank: "productive",
  match_pairs: "memory",
  fill_in_blank: "exit",
  dialogue_response: "productive",
  yes_no_question: "exit",
};

const PHASE_ORDER: LessonPhase[] = [
  "preview",
  "input",
  "guided",
  "productive",
  "memory",
  "exit",
];

export function getPhaseLabel(phase: LessonPhase): string {
  const labels: Record<LessonPhase, string> = {
    preview: "Listen & Preview",
    input: "Learn",
    guided: "Practice",
    productive: "Produce",
    memory: "Remember",
    exit: "Checkpoint",
  };
  return labels[phase];
}

export function getPhaseColor(phase: LessonPhase): string {
  const colors: Record<LessonPhase, string> = {
    preview: "from-violet-500 to-purple-600",
    input: "from-sky-500 to-blue-600",
    guided: "from-emerald-500 to-teal-600",
    productive: "from-orange-500 to-amber-600",
    memory: "from-pink-500 to-rose-600",
    exit: "from-indigo-500 to-violet-600",
  };
  return colors[phase];
}

// --- Seeded shuffle & distractors (shared with seed generation) ---

export { seededShuffle } from "@/lib/seeded-shuffle";

function distractors(
  target: VocabItem,
  pool: VocabItem[],
  field: "english" | "hanzi" | "pinyin",
  seed: string,
  count = 3
): string[] {
  const seen = new Set<string>([target[field]]);
  const result: string[] = [];
  for (const v of seededShuffle(
    pool.filter((item) => item.id !== target.id),
    seed
  )) {
    const value = v[field];
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
    if (result.length >= count) break;
  }
  return result;
}

function buildShuffledOptions(correct: string, wrong: string[], seed: string): string[] {
  const seen = new Set<string>();
  const unique = [correct, ...wrong].filter((option) => {
    if (seen.has(option)) return false;
    seen.add(option);
    return true;
  });
  return seededShuffle(unique, seed);
}

function englishGloss(english: string): string {
  return englishWithoutToneLabel(english.split("/")[0].trim());
}

function toneForVocab(v: VocabItem): string | null {
  const fromEnglish = extractToneFromEnglish(v.english);
  if (fromEnglish) return fromEnglish;
  if (!isToneDrillVocab(v.id)) return null;
  const tone = getSyllableTone(v.pinyin.trim());
  return tone === "0" ? null : tone;
}

export interface BuildLessonOptions {
  lessonId: string;
  vocab: VocabItem[];
  sentences: Sentence[];
  ctx: LessonContext;
  getImageUrl?: (vocabId: string) => string | undefined;
  /** Wider pool for distractors (starter band uses prior + preview vocab). */
  distractorPool?: VocabItem[];
}

/**
 * Template-driven exercise builder. Fills pre-approved exercise templates
 * from lesson vocab, constrained by band-specific exercise mix.
 */
export function buildLessonExercises(options: BuildLessonOptions): BaseExercise[] {
  const { lessonId, vocab, sentences, ctx, getImageUrl, distractorPool } = options;
  const mix = getExerciseMix(ctx);
  const targetCount = getTargetExerciseCount(ctx.band, ctx.lessonOrderIndex);
  const pool = distractorPool && distractorPool.length > 0 ? distractorPool : vocab;
  const exercises: BaseExercise[] = [];
  let order = 0;

  const englishDistractorsFor = (target: VocabItem, seed: string, count = 3) =>
    ctx.band === "starter" && distractorPool
      ? buildEnglishDistractors(target, pool, seed, count)
      : distractors(target, vocab, "english", seed, count).map(englishGloss);

  const hanziDistractorsFor = (target: VocabItem, seed: string, count = 3) =>
    ctx.band === "starter" && distractorPool
      ? buildHanziDistractors(target, pool, seed, count)
      : distractors(target, vocab, "hanzi", seed, count);

  const pinyinDistractorsFor = (target: VocabItem, seed: string, count = 3) =>
    distractors(target, pool, "pinyin", seed, count);

  const add = (
    type: ExerciseType,
    prompt: string,
    payload: BaseExercise["payload"],
    explanation?: string
  ) => {
    exercises.push({
      id: `${lessonId}-ex-${order}`,
      lessonId,
      type,
      prompt,
      payload,
      orderIndex: order++,
      explanation,
    });
  };

  const vocabCycle = [...vocab];
  let vi = 0;
  const nextVocab = () => {
    const v = vocabCycle[vi % vocabCycle.length];
    vi++;
    return v;
  };

  // Preview: listening exercises
  for (let i = 0; i < mix.listening; i++) {
    const v = nextVocab();
    const imageUrl = getImageUrl?.(v.id);
    add(
      "listening",
      "Listen and select the meaning",
      {
        hanzi: v.hanzi,
        options: buildShuffledOptions(
          englishGloss(v.english),
          englishDistractorsFor(v, `${lessonId}-${v.id}-li-d`),
          `${lessonId}-${v.id}-li`
        ),
        correctAnswer: englishGloss(v.english),
        ...(imageUrl ? { imageUrl } : {}),
        pinyin: v.pinyin,
      },
      `You heard: ${v.hanzi} (${v.pinyin})`
    );
  }

  // Sentence listening / comprehension for communicative starter lessons
  for (let i = 0; i < mix.sentence_comprehension; i++) {
    const s = sentences[i % Math.max(sentences.length, 1)];
    if (!s) continue;
    const wrongEnglish = seededShuffle(
      pool
        .map((item) => englishGloss(item.english))
        .filter((gloss) => gloss !== englishGloss(s.english.split("—")[0])),
      `${lessonId}-${s.id}-sc-d`
    ).slice(0, 3);
    add(
      "multiple_choice",
      "What does this sentence mean?",
      {
        question: "Choose the best English meaning.",
        displaySentence: s.hanzi,
        pinyin: s.pinyin,
        options: buildShuffledOptions(
          s.english.replace(/[.!？?]/g, "").trim(),
          wrongEnglish,
          `${lessonId}-${s.id}-sc`
        ),
        correctAnswer: s.english.replace(/[.!？?]/g, "").trim(),
      },
      s.grammarNotes ?? s.english
    );
  }

  // Input: pinyin recognition
  for (let i = 0; i < mix.pinyin_recognition; i++) {
    const v = nextVocab();
    const imageUrl = getImageUrl?.(v.id);
    add(
      "pinyin_recognition",
      "Select the correct pinyin",
      {
        hanzi: v.hanzi,
        options: buildShuffledOptions(
          v.pinyin,
          pinyinDistractorsFor(v, `${lessonId}-${v.id}-py-d`),
          `${lessonId}-${v.id}-py`
        ),
        correctAnswer: v.pinyin,
        ...(imageUrl ? { imageUrl } : {}),
      },
      `${v.hanzi} is pronounced ${v.pinyin}.`
    );
  }

  // Guided: multiple choice
  for (let i = 0; i < mix.multiple_choice; i++) {
    const v = nextVocab();
    const imageUrl = getImageUrl?.(v.id);
    add(
      "multiple_choice",
      "Select the correct translation",
      {
        question: `What does "${v.hanzi}" mean?`,
        options: buildShuffledOptions(
          englishGloss(v.english),
          englishDistractorsFor(v, `${lessonId}-${v.id}-mc-d`),
          `${lessonId}-${v.id}-mc`
        ),
        correctAnswer: englishGloss(v.english),
        displayHanzi: v.hanzi,
        ...(imageUrl ? { imageUrl } : {}),
        pinyin: v.pinyin,
      },
      `${v.hanzi} (${v.pinyin}) means "${v.english}".`
    );
  }

  // Productive: typed English (tone drills use tone + English instead)
  for (let i = 0; i < mix.hanzi_to_english; i++) {
    const v = nextVocab();
    const imageUrl = getImageUrl?.(v.id);
    const tone = toneForVocab(v);
    if (tone) {
      const gloss = englishGloss(v.english);
      add(
        "tone_and_english",
        "Select the tone and type the English meaning",
        {
          hanzi: v.hanzi,
          toneOptions: ["1", "2", "3", "4"],
          correctTone: tone,
          acceptedEnglishAnswers: [gloss],
          ...(imageUrl ? { imageUrl } : {}),
          emoji: v.emoji,
        },
        `${v.hanzi} = ${gloss} (tone ${tone})`
      );
      continue;
    }

    add(
      "hanzi_to_english",
      "Type the English meaning",
      {
        hanzi: v.hanzi,
        pinyin: v.pinyin,
        acceptedAnswers: [v.english, englishGloss(v.english)],
        ...(imageUrl ? { imageUrl } : {}),
      },
      `${v.hanzi} = ${v.english}`
    );
  }

  // Productive: word bank
  for (let i = 0; i < mix.english_to_hanzi_word_bank; i++) {
    const v = nextVocab();
    const chars = v.hanzi.split("");
    const decoys = seededShuffle(
      vocab.filter((x) => x.id !== v.id).flatMap((x) => x.hanzi.split("")),
      `${lessonId}-${v.id}-wb-d`
    ).slice(0, Math.max(4, 10 - chars.length));
    add(
      "english_to_hanzi_word_bank",
      "Build the hanzi for this word",
      {
        english: englishGloss(v.english),
        wordBank: seededShuffle([...chars, ...decoys], `${lessonId}-${v.id}-wb`),
        correctAnswer: chars,
        imageUrl: getImageUrl?.(v.id),
      },
      `The hanzi for "${v.english}" is ${v.hanzi}.`
    );
  }

  // Memory: reverse pinyin
  for (let i = 0; i < mix.reverse_pinyin; i++) {
    const v = nextVocab();
    add(
      "reverse_pinyin",
      "Which hanzi matches this pinyin?",
      {
        pinyin: v.pinyin,
        options: buildShuffledOptions(
          v.hanzi,
          hanziDistractorsFor(v, `${lessonId}-${v.id}-rp-d`),
          `${lessonId}-${v.id}-rp`
        ),
        correctAnswer: v.hanzi,
      },
      `${v.pinyin} → ${v.hanzi}`
    );
  }

  // Starter mini-dialogues
  if (mix.dialogue_response > 0) {
    const dialogues = seededShuffle(
      getStarterDialoguesForLesson(lessonId),
      `${lessonId}-dlg`
    ).slice(0, mix.dialogue_response);
    dialogues.forEach((dialogue, index) => {
      const wrong = dialogue.wrongAnswers.filter((answer) => answer !== dialogue.correctAnswer);
      const options = buildShuffledOptions(
        dialogue.correctAnswer,
        wrong,
        `${lessonId}-${dialogue.id}-${index}-dlg`
      );
      add(
        "dialogue_response",
        "Choose the best response",
        {
          lines: dialogue.lines,
          question: dialogue.question,
          options,
          correctAnswer: dialogue.correctAnswer,
        },
        dialogue.explanation
      );
    });
  }

  // Starter yes/no comprehension checks
  if (mix.yes_no_question > 0) {
    const items = seededShuffle(
      getStarterYesNoForLesson(lessonId),
      `${lessonId}-yn`
    ).slice(0, mix.yes_no_question);
    items.forEach((item) => {
      add(
        "yes_no_question",
        "Is this understanding correct?",
        {
          statement: item.statement,
          statementPinyin: item.statementPinyin,
          claim: item.claim,
          correctAnswer: item.correctAnswer,
        },
        item.explanation
      );
    });
  }

  // Memory: match pairs (one exercise, multiple pairs)
  if (mix.match_pairs > 0) {
    const pairSource =
      vocab.length >= 4
        ? vocab
        : [
            ...vocab,
            ...pool.filter((item) => !vocab.some((v) => v.id === item.id)),
          ];
    if (pairSource.length >= 3) {
      const pairCount = Math.min(4, pairSource.length);
      const pairVocab = seededShuffle(pairSource, `${lessonId}-pairs`).slice(0, pairCount);
      add("match_pairs", "Match each hanzi to its meaning", {
        pairs: pairVocab.map((v) => ({
          id: v.id,
          left: v.hanzi,
          right: englishGloss(v.english),
          imageUrl: getImageUrl?.(v.id),
        })),
      });
    }
  }

  // Exit: fill in blank from sentences
  for (let i = 0; i < mix.fill_in_blank; i++) {
    const s = sentences[i % sentences.length];
    if (!s) continue;
    const parts = s.hanzi.replace("。", "").split("");
    const blankIdx = parts.findIndex(
      (c) => c !== "我" && c !== "是" && c !== "的" && c.length === 1
    );
    if (blankIdx < 0) continue;
    const blankChar = parts[blankIdx];
    const display = parts.map((c, idx) => (idx === blankIdx ? "___" : c)).join("") + "。";
    add(
      "fill_in_blank",
      "Fill in the missing character",
      {
        sentence: display,
        blankIndex: blankIdx,
        correctAnswer: blankChar,
        fullSentence: s.hanzi,
        fullPinyin: s.pinyin,
        options: buildShuffledOptions(
          blankChar,
          seededShuffle(
            pool.map((item) => item.hanzi[0]),
            `${lessonId}-${s.id}-fib-d`
          )
            .filter((c) => c !== blankChar)
            .filter((c, idx, arr) => arr.indexOf(c) === idx)
            .slice(0, 3),
          `${lessonId}-${s.id}-fib`
        ),
      },
      s.grammarNotes ?? `Full sentence: ${s.hanzi} — ${s.english}`
    );
  }

  // Sort by lesson phase for Duolingo-like flow
  exercises.sort((a, b) => {
    const pa = PHASE_ORDER.indexOf(PHASE_FOR_TYPE[a.type]);
    const pb = PHASE_ORDER.indexOf(PHASE_FOR_TYPE[b.type]);
    return pa - pb || a.orderIndex - b.orderIndex;
  });

  // Re-index after sort
  exercises.forEach((ex, idx) => {
    ex.orderIndex = idx;
    ex.id = `${lessonId}-ex-${idx}`;
  });

  return exercises.slice(0, targetCount);
}
