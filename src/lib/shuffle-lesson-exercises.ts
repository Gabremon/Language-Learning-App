import type { BaseExercise } from "@/types/exercises";
import { PHASE_FOR_TYPE, type LessonPhase } from "@/lib/lesson-generator";
import { seededShuffle } from "@/lib/seeded-shuffle";

const PHASE_SEQUENCE: LessonPhase[] = [
  "preview",
  "input",
  "guided",
  "productive",
  "memory",
  "exit",
];

/**
 * Randomize exercise order within each lesson phase block.
 * Keeps the broad arc (listen → learn → practice → checkpoint) but
 * varies the order inside each section on every playthrough.
 */
export function shuffleLessonExercises(
  exercises: BaseExercise[],
  seed: string
): BaseExercise[] {
  const buckets = new Map<LessonPhase, BaseExercise[]>();
  for (const phase of PHASE_SEQUENCE) {
    buckets.set(phase, []);
  }

  for (const exercise of exercises) {
    const phase = PHASE_FOR_TYPE[exercise.type];
    buckets.get(phase)?.push(exercise);
  }

  const shuffled: BaseExercise[] = [];
  for (const phase of PHASE_SEQUENCE) {
    const group = buckets.get(phase) ?? [];
    shuffled.push(...seededShuffle(group, `${seed}:${phase}`));
  }

  return shuffled;
}
