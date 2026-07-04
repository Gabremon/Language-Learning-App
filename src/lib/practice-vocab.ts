import { sortLessonsByCourseOrder } from "@/lib/course-utils";
import { getVocabMemory } from "@/lib/progress";
import type { UserProgress } from "@/lib/progress";
import { isDueForReview } from "@/lib/srs";
import type { VocabMemory } from "@/lib/srs";
import type { Lesson, Unit, VocabItem } from "@/types/course";

export const MAX_REVIEW_ITEMS = 10;

export interface PracticeVocabContext {
  lessons: Lesson[];
  units: Unit[];
  lessonVocabMap: Record<string, string[]>;
  vocabItems: VocabItem[];
}

/**
 * Lesson ids whose vocabulary is available for practice.
 * Includes all completed lessons plus the next lesson only once its words have been seen in exercises.
 */
export function getLessonIdsUpToCurrent(
  lessons: Lesson[],
  units: Unit[],
  progress: Pick<UserProgress, "currentLessonId" | "completedLessonIds" | "vocabMemory">,
  lessonVocabMap: Record<string, string[]>
): string[] {
  const ordered = sortLessonsByCourseOrder(lessons, units);

  let maxIdx = -1;
  for (const lessonId of progress.completedLessonIds) {
    const idx = ordered.findIndex((lesson) => lesson.id === lessonId);
    if (idx > maxIdx) maxIdx = idx;
  }

  const nextIdx = maxIdx + 1;
  if (nextIdx < ordered.length) {
    const nextLesson = ordered[nextIdx];
    const nextVocab = lessonVocabMap[nextLesson.id] ?? [];
    const hasSeenNext = nextVocab.some(
      (vocabId) => (progress.vocabMemory[vocabId]?.timesSeen ?? 0) > 0
    );
    if (hasSeenNext) maxIdx = nextIdx;
  }

  if (maxIdx < 0) {
    if (progress.completedLessonIds.length === 0) return [];
    return progress.completedLessonIds.filter(
      (lessonId) => (lessonVocabMap[lessonId]?.length ?? 0) > 0
    );
  }
  return ordered.slice(0, maxIdx + 1).map((lesson) => lesson.id);
}

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

/** Vocabulary introduced in lessons the learner has reached so far. */
export function getPracticeVocabPool(
  progress: UserProgress,
  context: PracticeVocabContext
): VocabItem[] {
  const lessonIds = getLessonIdsUpToCurrent(
    context.lessons,
    context.units,
    progress,
    context.lessonVocabMap
  );
  const allowedIds = collectVocabIdsForLessons(lessonIds, context.lessonVocabMap);
  if (allowedIds.size === 0) return [];

  const byId = new Map(context.vocabItems.map((item) => [item.id, item]));
  return [...allowedIds]
    .map((id) => byId.get(id))
    .filter((item): item is VocabItem => item != null);
}

export function filterMemoriesToPracticePool(
  memories: VocabMemory[],
  progress: UserProgress,
  context: PracticeVocabContext
): VocabMemory[] {
  const lessonIds = getLessonIdsUpToCurrent(
    context.lessons,
    context.units,
    progress,
    context.lessonVocabMap
  );
  const allowedIds = collectVocabIdsForLessons(lessonIds, context.lessonVocabMap);
  return memories.filter((memory) => allowedIds.has(memory.vocabItemId));
}

export function countPracticeWordsAvailable(
  progress: UserProgress,
  context: PracticeVocabContext,
  maxItems = MAX_REVIEW_ITEMS
): number {
  const lessonIds = getLessonIdsUpToCurrent(
    context.lessons,
    context.units,
    progress,
    context.lessonVocabMap
  );
  const allowedIds = collectVocabIdsForLessons(lessonIds, context.lessonVocabMap);
  if (allowedIds.size === 0) return 0;

  if (context.vocabItems.length === 0) {
    return Math.min(allowedIds.size, maxItems);
  }

  return Math.min(getPracticeVocabPool(progress, context).length, maxItems);
}

export function countDueReviewsInPracticePool(
  progress: UserProgress,
  memories: VocabMemory[],
  context: PracticeVocabContext
): number {
  return filterMemoriesToPracticePool(memories, progress, context).filter(
    (memory) => memory.timesSeen > 0 && isDueForReview(memory)
  ).length;
}

export function buildReviewQueue(
  progress: UserProgress,
  context: PracticeVocabContext,
  maxItems = MAX_REVIEW_ITEMS
): VocabItem[] {
  const pool = getPracticeVocabPool(progress, context);
  if (pool.length === 0) return [];

  const limit = Math.min(maxItems, pool.length);
  const withMemory = pool.map((vocab) => ({
    vocab,
    memory: getVocabMemory(progress, vocab.id),
  }));

  const due = withMemory
    .filter(({ memory }) => memory.timesSeen > 0 && isDueForReview(memory))
    .map(({ vocab }) => vocab);

  const practiced = withMemory
    .filter(({ vocab, memory }) => memory.timesSeen > 0 && !due.some((item) => item.id === vocab.id))
    .map(({ vocab }) => vocab);

  const queue = [...due, ...practiced];
  if (queue.length === 0) {
    return pool.slice(0, limit);
  }

  return queue.slice(0, limit);
}
