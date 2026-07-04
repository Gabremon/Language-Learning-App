import type { Course, Lesson, Unit, VocabItem } from "@/types/course";
import type { BaseExercise } from "@/types/exercises";

export interface CourseCatalog {
  course: Course;
  units: Unit[];
  lessons: Lesson[];
}

export interface LessonBundle {
  lesson: Lesson | null;
  exercises: BaseExercise[];
  vocab: VocabItem[];
}

export function getLessonsForUnit(lessons: Lesson[], unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/** Lessons in course order: unit order, then lesson order within each unit. */
export function sortLessonsByCourseOrder(lessons: Lesson[], units: Unit[]): Lesson[] {
  const unitOrder = new Map(units.map((unit) => [unit.id, unit.orderIndex]));
  return [...lessons].sort((a, b) => {
    const unitA = unitOrder.get(a.unitId) ?? 0;
    const unitB = unitOrder.get(b.unitId) ?? 0;
    return unitA - unitB || a.orderIndex - b.orderIndex;
  });
}

export function getNextLesson(
  lessons: Lesson[],
  currentLessonId: string,
  units?: Unit[]
): Lesson | null {
  const ordered = units ? sortLessonsByCourseOrder(lessons, units) : lessons;
  const idx = ordered.findIndex((lesson) => lesson.id === currentLessonId);
  if (idx < 0 || idx >= ordered.length - 1) return null;
  return ordered[idx + 1];
}

/** Lesson to show on "Continue" — first incomplete step, or current if still in progress. */
export function getContinueLesson(
  lessons: Lesson[],
  units: Unit[],
  currentLessonId: string | null,
  completedIds: string[]
): Lesson {
  const ordered = sortLessonsByCourseOrder(lessons, units);
  const completed = new Set(completedIds);

  const current = ordered.find((lesson) => lesson.id === currentLessonId);
  if (current && !completed.has(current.id)) return current;

  const nextIncomplete = ordered.find((lesson) => !completed.has(lesson.id));
  if (nextIncomplete) return nextIncomplete;

  return current ?? ordered[0];
}

export function isLessonUnlocked(
  lessonId: string,
  completedIds: string[],
  units: Unit[],
  lessons: Lesson[]
): boolean {
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return false;

  const unitLessons = getLessonsForUnit(lessons, lesson.unitId);
  const lessonIdx = unitLessons.findIndex((item) => item.id === lessonId);

  if (lessonIdx === 0) {
    const unitIdx = units.findIndex((unit) => unit.id === lesson.unitId);
    if (unitIdx === 0) return true;
    const prevUnit = units[unitIdx - 1];
    const prevUnitLessons = getLessonsForUnit(lessons, prevUnit.id);
    return prevUnitLessons.every((item) => completedIds.includes(item.id));
  }

  return completedIds.includes(unitLessons[lessonIdx - 1].id);
}

/** First unit with incomplete lessons, or the last unit if all complete. */
export function getActiveUnit(
  units: Unit[],
  lessons: Lesson[],
  completedIds: string[]
): Unit {
  const sorted = [...units].sort((a, b) => a.orderIndex - b.orderIndex);
  for (const unit of sorted) {
    const unitLessons = getLessonsForUnit(lessons, unit.id);
    if (unitLessons.some((lesson) => !completedIds.includes(lesson.id))) {
      return unit;
    }
  }
  return sorted[sorted.length - 1];
}
