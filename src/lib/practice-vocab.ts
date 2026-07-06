import type { VocabItem } from "@/types/course";
import { getVocabMemory, type UserProgress } from "@/lib/progress";
import { isDueForReview } from "@/lib/srs";
import { seededShuffle } from "@/lib/seeded-shuffle";

export const MAX_REVIEW_ITEMS = 10;

export function collectVocabIdsForLessons(
  lessonIds: string[],
  lessonVocabMap: Record<string, string[]>
): Set<string> {
  const ids = new Set<string>();
  for (const lessonId of lessonIds) {
    for (const vocabId of lessonVocabMap[lessonId] ?? []) {
      ids.add(vocabId);
    }
  }
  return ids;
}

export function getPracticeVocabPool(
  progress: UserProgress,
  vocabItems: VocabItem[],
  lessonVocabMap: Record<string, string[]>
): VocabItem[] {
  const allowedIds = collectVocabIdsForLessons(progress.completedLessonIds, lessonVocabMap);
  if (allowedIds.size === 0) return [];
  return vocabItems.filter((v) => allowedIds.has(v.id));
}

export function buildReviewQueue(
  progress: UserProgress,
  vocabItems: VocabItem[],
  lessonVocabMap: Record<string, string[]>,
  maxItems = MAX_REVIEW_ITEMS,
  seed: string
): VocabItem[] {
  const pool = getPracticeVocabPool(progress, vocabItems, lessonVocabMap);
  if (pool.length === 0) return [];

  const due: VocabItem[] = [];
  const rest: VocabItem[] = [];

  for (const vocab of pool) {
    const memory = getVocabMemory(progress, vocab.id);
    if (isDueForReview(memory)) {
      due.push(vocab);
    } else {
      rest.push(vocab);
    }
  }

  const queue = [
    ...seededShuffle(due, `${seed}:due`),
    ...seededShuffle(rest, `${seed}:rest`),
  ].slice(0, maxItems);

  return queue.length > 0 ? queue : seededShuffle(pool, seed).slice(0, maxItems);
}

export function countDueReviewsInPracticePool(
  progress: UserProgress,
  lessonVocabMap: Record<string, string[]>
): number {
  const ids = collectVocabIdsForLessons(progress.completedLessonIds, lessonVocabMap);
  let count = 0;
  for (const id of ids) {
    if (isDueForReview(getVocabMemory(progress, id))) count++;
  }
  return count;
}

export function countPracticeWordsAvailable(
  progress: UserProgress,
  lessonVocabMap: Record<string, string[]>,
  maxItems = MAX_REVIEW_ITEMS
): number {
  const ids = collectVocabIdsForLessons(progress.completedLessonIds, lessonVocabMap);
  return Math.min(ids.size, maxItems);
}
