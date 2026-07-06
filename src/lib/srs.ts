export interface VocabMemory {
  vocabItemId: string;
  strength: number;
  timesSeen: number;
  timesCorrect: number;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
}

const INTERVALS_MS: Record<number, number> = {
  0: 0,
  1: 24 * 60 * 60 * 1000,
  2: 3 * 24 * 60 * 60 * 1000,
  3: 7 * 24 * 60 * 60 * 1000,
  4: 14 * 24 * 60 * 60 * 1000,
};

const MAX_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;
const INCORRECT_DELAY_MS = 10 * 60 * 1000;

export function getReviewIntervalMs(strength: number): number {
  if (strength >= 5) return MAX_INTERVAL_MS;
  return INTERVALS_MS[strength] ?? MAX_INTERVAL_MS;
}

export function updateVocabMemoryOnReview(
  memory: VocabMemory,
  isCorrect: boolean
): VocabMemory {
  const now = new Date();
  const timesSeen = memory.timesSeen + 1;
  const timesCorrect = memory.timesCorrect + (isCorrect ? 1 : 0);

  let strength = memory.strength;
  let nextReviewAt: Date;

  if (isCorrect) {
    strength = Math.min(strength + 1, 10);
    nextReviewAt = new Date(now.getTime() + getReviewIntervalMs(strength));
  } else {
    strength = Math.max(strength - 1, 0);
    nextReviewAt = new Date(now.getTime() + INCORRECT_DELAY_MS);
  }

  return {
    ...memory,
    strength,
    timesSeen,
    timesCorrect,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewAt.toISOString(),
  };
}

export function createInitialVocabMemory(vocabItemId: string): VocabMemory {
  return {
    vocabItemId,
    strength: 0,
    timesSeen: 0,
    timesCorrect: 0,
    lastReviewedAt: null,
    nextReviewAt: new Date().toISOString(),
  };
}

export function isDueForReview(memory: VocabMemory): boolean {
  if (!memory.nextReviewAt) return true;
  return new Date(memory.nextReviewAt) <= new Date();
}

export function getDueReviewCount(memories: VocabMemory[]): number {
  return memories.filter(isDueForReview).length;
}

export type VocabMasteryLevel = "new" | "learning" | "familiar" | "experienced" | "mastered";

export const MASTERY_MAX_STRENGTH = 7;

export const MASTERY_LABELS: Record<VocabMasteryLevel, string> = {
  new: "New",
  learning: "Learning",
  familiar: "Familiar",
  experienced: "Experienced",
  mastered: "Mastered",
};

export function getVocabMasteryLevel(memory: VocabMemory): VocabMasteryLevel {
  if (memory.timesSeen === 0) return "new";
  if (memory.strength <= 2) return "learning";
  if (memory.strength <= 4) return "familiar";
  if (memory.strength < MASTERY_MAX_STRENGTH) return "experienced";
  return "mastered";
}

export function getMasteryProgress(memory: VocabMemory): number {
  if (memory.timesSeen === 0) return 0;
  return Math.min(100, Math.round((memory.strength / MASTERY_MAX_STRENGTH) * 100));
}

export function getMasteryLevelMessage(level: VocabMasteryLevel): string | null {
  switch (level) {
    case "familiar":
      return "Getting familiar — keep reviewing!";
    case "experienced":
      return "Experienced with this word!";
    case "mastered":
      return "Mastered — long review interval unlocked.";
    default:
      return null;
  }
}
