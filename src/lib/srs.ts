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
