import "server-only";

import type { LessonBundle } from "@/lib/course-utils";
import { DEMO_LESSON_ID } from "@/lib/demo";
import { getLessonBundle } from "@/lib/data/course";
import {
  getExercisesForLesson,
  getLessonById,
  getVocabForLesson,
} from "@/data/seed";

export async function loadLessonBundle(lessonId: string): Promise<LessonBundle> {
  try {
    return await getLessonBundle(lessonId);
  } catch (err) {
    if (lessonId !== DEMO_LESSON_ID) throw err;

    const lesson = getLessonById(lessonId);
    const exercises = getExercisesForLesson(lessonId);
    const vocab = getVocabForLesson(lessonId);

    if (!lesson || exercises.length === 0) {
      throw err;
    }

    console.warn("[loadLessonBundle] Using local seed fallback for demo lesson");
    return { lesson, exercises, vocab };
  }
}
