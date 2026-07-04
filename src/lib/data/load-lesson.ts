import "server-only";

import type { LessonBundle } from "@/lib/course-utils";
import { getLessonBundle } from "@/lib/data/course";
import { normalizeExercises } from "@/lib/exercise-normalize";

function withNormalizedExercises(bundle: LessonBundle): LessonBundle {
  return { ...bundle, exercises: normalizeExercises(bundle.exercises) };
}

export async function loadLessonBundle(lessonId: string): Promise<LessonBundle> {
  try {
    const bundle = await getLessonBundle(lessonId);
    if (bundle.lesson && bundle.exercises.length > 0) {
      return withNormalizedExercises(bundle);
    }
    throw new Error(`Lesson ${lessonId} not found in database`);
  } catch (dbErr) {
    const { buildLocalLessonBundle } = await import("@/lib/local-lesson-bundle");
    const local = buildLocalLessonBundle(lessonId);
    if (local) {
      console.warn(
        `[loadLessonBundle] Using local seed for ${lessonId}. ` +
          "Apply HSK migrations in Supabase to persist lesson progress."
      );
      return withNormalizedExercises(local);
    }
    throw dbErr;
  }
}
