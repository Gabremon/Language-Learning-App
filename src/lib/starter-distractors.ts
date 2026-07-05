import type { VocabItem } from "@/types/course";
import { STARTER_LESSONS } from "@/data/starter-hsk1/starter-lessons";
import { seededShuffle } from "@/lib/seeded-shuffle";

/** Preview words sprinkled in as distractors before the learner formally meets them. */
const TEASER_VOCAB_IDS = [
  "v-ta-he",
  "v-ta-she",
  "v-shui",
  "v-da",
  "v-xiao",
  "v-shu",
  "v-mao",
  "v-gou",
  "v-cha",
  "v-pengyou",
  "v-duibuqi",
  "v-meiguanxi",
  "v-qingwen",
  "v-ye",
  "v-dou",
  "v-tamen",
  "v-women",
  "v-hen",
  "v-de",
  "v-he-conj",
  "v-ne",
  "v-ba-particle",
  "v-baba",
  "v-mama",
  "v-gege",
  "v-jiejie",
  "v-yisheng",
  "v-xihuan",
  "v-chi",
  "v-he",
  "v-zai",
  "v-zhe",
  "v-na",
  "v-duoshao",
  "v-jintian",
  "v-mingtian",
  "v-leng",
  "v-re",
];

const STARTER_LESSON_ORDER = STARTER_LESSONS.map((lesson) => lesson.id);

export function getStarterLessonIndex(lessonId: string): number {
  return STARTER_LESSON_ORDER.indexOf(lessonId);
}

export function isStarterLesson(lessonId: string): boolean {
  return getStarterLessonIndex(lessonId) >= 0;
}

/** Vocab IDs from all starter lessons strictly before the current one. */
export function getPriorStarterVocabIds(lessonId: string): string[] {
  const index = getStarterLessonIndex(lessonId);
  if (index <= 0) return [];
  const seen = new Set<string>();
  for (let i = 0; i < index; i++) {
    for (const id of STARTER_LESSONS[i].vocab) {
      seen.add(id);
    }
  }
  return [...seen];
}

/**
 * Broader distractor pool for starter lessons: prior lesson vocab + preview teasers
 * the learner hasn't formally studied yet.
 */
export function getStarterDistractorPool(
  lessonId: string,
  lessonVocab: VocabItem[],
  allVocab: VocabItem[]
): VocabItem[] {
  const byId = new Map(allVocab.map((item) => [item.id, item]));
  const lessonIds = new Set(lessonVocab.map((item) => item.id));
  const priorIds = getPriorStarterVocabIds(lessonId);
  const seenIds = new Set([...lessonIds, ...priorIds]);

  const pool: VocabItem[] = [];
  const seenHanzi = new Set<string>();

  const add = (item: VocabItem | undefined) => {
    if (!item || seenHanzi.has(item.hanzi)) return;
    seenHanzi.add(item.hanzi);
    pool.push(item);
  };

  for (const id of priorIds) {
    add(byId.get(id));
  }

  for (const item of lessonVocab) {
    add(item);
  }

  const teaserCount = Math.min(12, 4 + getStarterLessonIndex(lessonId));
  const teasers = seededShuffle(
    TEASER_VOCAB_IDS.filter((id) => !seenIds.has(id)),
    `${lessonId}-teasers`
  )
    .slice(0, teaserCount)
    .map((id) => byId.get(id))
    .filter((item): item is VocabItem => item != null);

  for (const item of teasers) {
    add(item);
  }

  return pool.length > 0 ? pool : lessonVocab;
}

export function englishGloss(english: string): string {
  return english.split("/")[0].trim();
}

export function buildEnglishDistractors(
  target: VocabItem,
  pool: VocabItem[],
  seed: string,
  count = 3
): string[] {
  const seen = new Set<string>([englishGloss(target.english)]);
  const result: string[] = [];
  for (const item of seededShuffle(
    pool.filter((entry) => entry.id !== target.id),
    seed
  )) {
    const gloss = englishGloss(item.english);
    if (seen.has(gloss)) continue;
    seen.add(gloss);
    result.push(gloss);
    if (result.length >= count) break;
  }
  return result;
}

export function buildHanziDistractors(
  target: VocabItem,
  pool: VocabItem[],
  seed: string,
  count = 3
): string[] {
  const seen = new Set<string>([target.hanzi]);
  const result: string[] = [];
  for (const item of seededShuffle(
    pool.filter((entry) => entry.id !== target.id),
    seed
  )) {
    if (seen.has(item.hanzi)) continue;
    seen.add(item.hanzi);
    result.push(item.hanzi);
    if (result.length >= count) break;
  }
  return result;
}
