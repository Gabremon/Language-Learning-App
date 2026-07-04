"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { UserProgress } from "@/lib/progress";
import {
  addXp,
  applyLessonCompletion,
  getAllVocabMemories,
  setVocabMemory,
  updateStreak,
  getXpForLesson,
} from "@/lib/progress";
import {
  fetchUserProgress,
  insertLessonAttempt,
  resetUserProgress,
  saveUserProgressState,
} from "@/lib/progress-db";
import {
  clearGuestProgress,
  loadGuestProgress,
  saveGuestProgress,
} from "@/lib/guest-progress";
import type { VocabMemory } from "@/lib/srs";

interface ProgressContextValue {
  user: User | null;
  progress: UserProgress | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  retryLoad: () => Promise<void>;
  saveProgress: (progress: UserProgress) => Promise<void>;
  completeLesson: (
    lessonId: string,
    score: number,
    totalQuestions: number,
    nextLessonId?: string | null
  ) => Promise<{ progress: UserProgress; xpGained: number }>;
  updateVocabMemories: (memories: VocabMemory[]) => Promise<void>;
  applyReviewUpdate: (
    vocabItemId: string,
    memory: VocabMemory,
    xpBonus?: number
  ) => Promise<void>;
  resetProgress: () => Promise<void>;
  signOut: () => Promise<void>;
  getAllMemories: () => VocabMemory[];
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgressForUser = useCallback(
    async (userId: string) => {
      setError(null);
      const data = await fetchUserProgress(supabase, userId);
      setProgress(data);
      setIsGuest(false);
    },
    [supabase]
  );

  const retryLoad = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await loadProgressForUser(user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load progress";
      setError(message);
      console.error("[ProgressProvider]", err);
    } finally {
      setLoading(false);
    }
  }, [user, loadProgressForUser]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        setUser(currentUser);
        if (currentUser) {
          clearGuestProgress();
          await loadProgressForUser(currentUser.id);
        } else {
          setProgress(loadGuestProgress());
          setIsGuest(true);
        }
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : "Failed to load progress";
        setError(message);
        console.error("[ProgressProvider]", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        setLoading(true);
        clearGuestProgress();
        try {
          await loadProgressForUser(nextUser.id);
          setError(null);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load progress";
          setError(message);
          console.error("[ProgressProvider]", err);
        } finally {
          setLoading(false);
        }
      } else {
        setProgress(loadGuestProgress());
        setIsGuest(true);
        setError(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProgressForUser]);

  const saveProgress = useCallback(
    async (nextProgress: UserProgress) => {
      if (isGuest || !user) {
        setProgress(nextProgress);
        saveGuestProgress(nextProgress);
        return;
      }
      setProgress(nextProgress);
      try {
        await saveUserProgressState(supabase, user.id, nextProgress);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save progress";
        setError(message);
        throw err;
      }
    },
    [supabase, user, isGuest]
  );

  const completeLesson = useCallback(
    async (
      lessonId: string,
      score: number,
      totalQuestions: number,
      nextLessonId?: string | null
    ) => {
      if (!progress) {
        throw new Error("Progress not loaded");
      }

      const xpGained = getXpForLesson(score, totalQuestions);

      if (isGuest || !user) {
        const attempt = {
          id: `guest-${Date.now()}`,
          lessonId,
          score,
          totalQuestions,
          completedAt: new Date().toISOString(),
        };
        const nextProgress = applyLessonCompletion(
          progress,
          lessonId,
          score,
          totalQuestions,
          attempt,
          nextLessonId
        );
        setProgress(nextProgress);
        saveGuestProgress(nextProgress);
        return { progress: nextProgress, xpGained };
      }

      try {
        const attempt = await insertLessonAttempt(
          supabase,
          user.id,
          lessonId,
          score,
          totalQuestions
        );

        const nextProgress = applyLessonCompletion(
          progress,
          lessonId,
          score,
          totalQuestions,
          attempt,
          nextLessonId
        );

        await saveUserProgressState(supabase, user.id, nextProgress);
        setProgress(nextProgress);
        setError(null);
        return { progress: nextProgress, xpGained };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save lesson";
        setError(message);
        throw err;
      }
    },
    [supabase, user, progress, isGuest]
  );

  const updateVocabMemories = useCallback(
    async (memories: VocabMemory[]) => {
      if (!progress) return;

      let nextProgress = progress;
      for (const memory of memories) {
        nextProgress = setVocabMemory(nextProgress, memory);
      }
      await saveProgress(nextProgress);
    },
    [progress, saveProgress]
  );

  const applyReviewUpdate = useCallback(
    async (vocabItemId: string, memory: VocabMemory, xpBonus = 0) => {
      if (!progress) return;

      let nextProgress = setVocabMemory(progress, memory);
      if (xpBonus > 0) {
        nextProgress = addXp(updateStreak(nextProgress), xpBonus);
      }
      await saveProgress(nextProgress);
    },
    [progress, saveProgress]
  );

  const resetProgress = useCallback(async () => {
    if (isGuest || !user) {
      clearGuestProgress();
      setProgress(loadGuestProgress());
      return;
    }
    await resetUserProgress(supabase, user.id);
    await loadProgressForUser(user.id);
  }, [supabase, user, isGuest, loadProgressForUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProgress(loadGuestProgress());
    setIsGuest(true);
    window.location.href = "/";
  }, [supabase]);

  const value: ProgressContextValue = {
    user,
    progress,
    isGuest,
    loading,
    error,
    retryLoad,
    saveProgress,
    completeLesson,
    updateVocabMemories,
    applyReviewUpdate,
    resetProgress,
    signOut,
    getAllMemories: () => (progress ? getAllVocabMemories(progress) : []),
  };

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}
