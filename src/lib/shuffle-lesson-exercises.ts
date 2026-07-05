import type { BaseExercise } from "@/types/exercises";
import { seededShuffle } from "@/lib/seeded-shuffle";

/** Fully randomize every exercise in a lesson — all types mixed together. */
export function shuffleLessonExercises(
  exercises: BaseExercise[],
  seed: string
): BaseExercise[] {
  return seededShuffle(exercises, seed);
}
