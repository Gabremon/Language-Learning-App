import type { VocabMemory } from "@/lib/srs";
import { createInitialVocabMemory } from "@/lib/srs";

export interface UserProgress {
  xp: number;
  streakCount: number;
  lastActiveDate: string | null;
  currentLessonId: string | null;
  completedLessonIds: string[];
  vocabMemory: Record<string, VocabMemory>;
  lessonAttempts: LessonAttempt[];
}

export interface LessonAttempt {
  id: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = getToday();
  if (progress.lastActiveDate === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let streakCount = 1;
  if (progress.lastActiveDate === yesterdayStr) {
    streakCount = progress.streakCount + 1;
  }

  return { ...progress, streakCount, lastActiveDate: today };
}

export function addXp(progress: UserProgress, amount: number): UserProgress {
  return { ...progress, xp: progress.xp + amount };
}

export function applyLessonCompletion(
  progress: UserProgress,
  lessonId: string,
  score: number,
  totalQuestions: number,
  attempt: LessonAttempt,
  nextLessonId?: string | null
): UserProgress {
  const completedLessonIds = progress.completedLessonIds.includes(lessonId)
    ? progress.completedLessonIds
    : [...progress.completedLessonIds, lessonId];

  const xpGained = score * 10 + (score === totalQuestions ? 20 : 0);

  return updateStreak(
    addXp(
      {
        ...progress,
        completedLessonIds,
        currentLessonId: nextLessonId ?? lessonId,
        lessonAttempts: [...progress.lessonAttempts, attempt],
      },
      xpGained
    )
  );
}

export function getVocabMemory(
  progress: UserProgress,
  vocabItemId: string
): VocabMemory {
  return (
    progress.vocabMemory[vocabItemId] ??
    createInitialVocabMemory(vocabItemId)
  );
}

export function setVocabMemory(
  progress: UserProgress,
  memory: VocabMemory
): UserProgress {
  return {
    ...progress,
    vocabMemory: {
      ...progress.vocabMemory,
      [memory.vocabItemId]: memory,
    },
  };
}

export function getAllVocabMemories(progress: UserProgress): VocabMemory[] {
  return Object.values(progress.vocabMemory);
}

export function getXpForLesson(score: number, totalQuestions: number): number {
  return score * 10 + (score === totalQuestions ? 20 : 0);
}
