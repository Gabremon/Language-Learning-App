import type { VocabMemory } from "@/lib/srs";
import { createInitialVocabMemory } from "@/lib/srs";

const STORAGE_KEY = "mandarin-learn-progress";

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

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streakCount: 0,
  lastActiveDate: null,
  currentLessonId: "lesson-1-1",
  completedLessonIds: [],
  vocabMemory: {},
  lessonAttempts: [],
};

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

export function completeLesson(
  progress: UserProgress,
  lessonId: string,
  score: number,
  totalQuestions: number
): UserProgress {
  const completedLessonIds = progress.completedLessonIds.includes(lessonId)
    ? progress.completedLessonIds
    : [...progress.completedLessonIds, lessonId];

  const attempt: LessonAttempt = {
    id: `attempt-${Date.now()}`,
    lessonId,
    score,
    totalQuestions,
    completedAt: new Date().toISOString(),
  };

  const xpGained = score * 10 + (score === totalQuestions ? 20 : 0);

  return updateStreak(
    addXp(
      {
        ...progress,
        completedLessonIds,
        currentLessonId: lessonId,
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
