"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  refreshProgress: () => Promise<void>;
  saveProgress: (
    progress: UserProgress | ((prev: UserProgress) => UserProgress)
  ) => Promise<void>;
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
  const progressRef = useRef<UserProgress | null>(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const loadProgressForUser = useCallback(
    async (userId: string) => {
      setError(null);
      const data = await fetchUserProgress(supabase, userId);
      progressRef.current = data;
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

  const refreshProgress = useCallback(async () => {
    if (isGuest || !user) return;
    try {
      await loadProgressForUser(user.id);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to refresh progress";
      setError(message);
      console.error("[ProgressProvider] refresh", err);
    }
  }, [user, isGuest, loadProgressForUser]);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null;
      if (!mounted) return;
      setUser(nextUser);

      // Defer async Supabase calls — running them inside this callback can deadlock getUser().
      setTimeout(async () => {
        if (!mounted) return;

        if (nextUser) {
          // Avoid TOKEN_REFRESHED — it races with in-flight lesson saves and can overwrite local progress.
          if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
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
              if (mounted) setLoading(false);
            }
          }
        } else if (event === "INITIAL_SESSION" || event === "SIGNED_OUT") {
          const guest = loadGuestProgress();
          progressRef.current = guest;
          setProgress(guest);
          setIsGuest(true);
          setError(null);
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProgressForUser]);

  const saveProgress = useCallback(
    async (update: UserProgress | ((prev: UserProgress) => UserProgress)) => {
      const prev = progressRef.current;
      if (!prev) {
        throw new Error("Progress not loaded");
      }

      const nextProgress = typeof update === "function" ? update(prev) : update;
      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (isGuest || !user) {
        saveGuestProgress(nextProgress);
        return;
      }

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
      const current = progressRef.current;
      if (!current) {
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
          current,
          lessonId,
          score,
          totalQuestions,
          attempt,
          nextLessonId
        );
        progressRef.current = nextProgress;
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

        const latest = progressRef.current ?? current;
        const nextProgress = applyLessonCompletion(
          latest,
          lessonId,
          score,
          totalQuestions,
          attempt,
          nextLessonId
        );

        await saveUserProgressState(supabase, user.id, nextProgress);
        progressRef.current = nextProgress;
        setProgress(nextProgress);
        setError(null);
        return { progress: nextProgress, xpGained };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save lesson";
        setError(message);
        throw err;
      }
    },
    [supabase, user, isGuest]
  );

  const updateVocabMemories = useCallback(
    async (memories: VocabMemory[]) => {
      if (!progressRef.current || memories.length === 0) return;

      await saveProgress((prev) => {
        let next = prev;
        for (const memory of memories) {
          next = setVocabMemory(next, memory);
        }
        return next;
      });
    },
    [saveProgress]
  );

  const applyReviewUpdate = useCallback(
    async (vocabItemId: string, memory: VocabMemory, xpBonus = 0) => {
      if (!progressRef.current) return;

      await saveProgress((prev) => {
        let next = setVocabMemory(prev, memory);
        if (xpBonus > 0) {
          next = addXp(updateStreak(next), xpBonus);
        }
        return next;
      });
    },
    [saveProgress]
  );

  const resetProgress = useCallback(async () => {
    if (isGuest || !user) {
      clearGuestProgress();
      const guest = loadGuestProgress();
      progressRef.current = guest;
      setProgress(guest);
      return;
    }
    await resetUserProgress(supabase, user.id);
    await loadProgressForUser(user.id);
  }, [supabase, user, isGuest, loadProgressForUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    const guest = loadGuestProgress();
    progressRef.current = guest;
    setProgress(guest);
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
    refreshProgress,
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
