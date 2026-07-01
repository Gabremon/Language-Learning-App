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

export function getNextLesson(lessons: Lesson[], currentLessonId: string): Lesson | null {
  const idx = lessons.findIndex((lesson) => lesson.id === currentLessonId);
  if (idx < 0 || idx >= lessons.length - 1) return null;
  return lessons[idx + 1];
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
