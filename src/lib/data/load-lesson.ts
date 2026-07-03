import "server-only";

import type { LessonBundle } from "@/lib/course-utils";
import { getLessonBundle } from "@/lib/data/course";
import {
  getExercisesForLesson,
  getLessonById,
  getVocabForLesson,
} from "@/data/seed";

function localLessonBundle(lessonId: string): LessonBundle | null {
  const lesson = getLessonById(lessonId);
  const exercises = getExercisesForLesson(lessonId);
  const vocab = getVocabForLesson(lessonId);

  if (!lesson || exercises.length === 0) {
    return null;
  }

  return { lesson, exercises, vocab };
}

export async function loadLessonBundle(lessonId: string): Promise<LessonBundle> {
  try {
    const bundle = await getLessonBundle(lessonId);
    if (bundle.lesson && bundle.exercises.length > 0) {
      return bundle;
    }
    throw new Error(`Lesson ${lessonId} not found in database`);
  } catch (dbErr) {
    const local = localLessonBundle(lessonId);
    if (local) {
      console.warn(
        `[loadLessonBundle] Using local seed for ${lessonId}. ` +
          "Apply HSK migrations in Supabase to persist lesson progress."
      );
      return local;
    }
    throw dbErr;
  }
}
