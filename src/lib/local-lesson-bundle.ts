import type { LessonBundle } from "@/lib/course-utils";
import {
  getExercisesForLesson,
  getLessonById,
  getVocabForLesson,
} from "@/data/seed";

export function buildLocalLessonBundle(lessonId: string): LessonBundle | null {
  const lesson = getLessonById(lessonId);
  const exercises = getExercisesForLesson(lessonId);
  const vocab = getVocabForLesson(lessonId);

  if (!lesson || exercises.length === 0) {
    return null;
  }

  return { lesson, exercises, vocab };
}
