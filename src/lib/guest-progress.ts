import type { UserProgress } from "@/lib/progress";
import { DEMO_LESSON_ID } from "@/lib/demo";

const STORAGE_KEY = "ori-guest-progress";

export const EMPTY_GUEST_PROGRESS: UserProgress = {
  xp: 0,
  streakCount: 0,
  lastActiveDate: null,
  currentLessonId: DEMO_LESSON_ID,
  completedLessonIds: [],
  vocabMemory: {},
  lessonAttempts: [],
};

export function loadGuestProgress(): UserProgress {
  if (typeof window === "undefined") return EMPTY_GUEST_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_GUEST_PROGRESS };
    return { ...EMPTY_GUEST_PROGRESS, ...JSON.parse(raw) } as UserProgress;
  } catch {
    return { ...EMPTY_GUEST_PROGRESS };
  }
}

export function saveGuestProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage full or unavailable — demo still works in-session
  }
}

export function clearGuestProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
