import { getContinueLesson, sortLessonsByCourseOrder } from "@/lib/course-utils";
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

/** Lesson ids from the start of the course through the learner's current lesson (inclusive). */
export function getLessonIdsUpToCurrent(
  lessons: Lesson[],
  units: Unit[],
  progress: Pick<UserProgress, "currentLessonId" | "completedLessonIds">
): string[] {
  const ordered = sortLessonsByCourseOrder(lessons, units);
  const current = getContinueLesson(
    lessons,
    units,
    progress.currentLessonId,
    progress.completedLessonIds
  );
  const idx = ordered.findIndex((lesson) => lesson.id === current.id);
  if (idx < 0) return [];
  return ordered.slice(0, idx + 1).map((lesson) => lesson.id);
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
  const lessonIds = getLessonIdsUpToCurrent(context.lessons, context.units, progress);
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
  const lessonIds = getLessonIdsUpToCurrent(context.lessons, context.units, progress);
  const allowedIds = collectVocabIdsForLessons(lessonIds, context.lessonVocabMap);
  return memories.filter((memory) => allowedIds.has(memory.vocabItemId));
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

  const due = pool
    .map((vocab) => ({
      vocab,
      memory: getVocabMemory(progress, vocab.id),
    }))
    .filter(({ memory }) => memory.timesSeen > 0 && isDueForReview(memory))
    .map(({ vocab }) => vocab);

  return due.slice(0, Math.min(maxItems, due.length));
}
