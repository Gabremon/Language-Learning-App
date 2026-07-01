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
import type { VocabMemory } from "@/lib/srs";

interface ProgressContextValue {
  user: User | null;
  progress: UserProgress | null;
  loading: boolean;
  saveProgress: (progress: UserProgress) => Promise<void>;
  completeLesson: (
    lessonId: string,
    score: number,
    totalQuestions: number
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
  const [loading, setLoading] = useState(true);

  const loadProgressForUser = useCallback(
    async (userId: string) => {
      const data = await fetchUserProgress(supabase, userId);
      setProgress(data);
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(currentUser);
      if (currentUser) {
        await loadProgressForUser(currentUser.id);
      } else {
        setProgress(null);
      }
      setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        setLoading(true);
        await loadProgressForUser(nextUser.id);
        setLoading(false);
      } else {
        setProgress(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProgressForUser]);

  const saveProgress = useCallback(
    async (nextProgress: UserProgress) => {
      if (!user) return;
      setProgress(nextProgress);
      await saveUserProgressState(supabase, user.id, nextProgress);
    },
    [supabase, user]
  );

  const completeLesson = useCallback(
    async (lessonId: string, score: number, totalQuestions: number) => {
      if (!user || !progress) {
        throw new Error("Not authenticated");
      }

      const xpGained = getXpForLesson(score, totalQuestions);
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
        attempt
      );

      await saveUserProgressState(supabase, user.id, nextProgress);
      setProgress(nextProgress);
      return { progress: nextProgress, xpGained };
    },
    [supabase, user, progress]
  );

  const updateVocabMemories = useCallback(
    async (memories: VocabMemory[]) => {
      if (!user || !progress) return;

      let nextProgress = progress;
      for (const memory of memories) {
        nextProgress = setVocabMemory(nextProgress, memory);
      }
      await saveProgress(nextProgress);
    },
    [user, progress, saveProgress]
  );

  const applyReviewUpdate = useCallback(
    async (vocabItemId: string, memory: VocabMemory, xpBonus = 0) => {
      if (!user || !progress) return;

      let nextProgress = setVocabMemory(progress, memory);
      if (xpBonus > 0) {
        nextProgress = addXp(updateStreak(nextProgress), xpBonus);
      }
      await saveProgress(nextProgress);
    },
    [user, progress, saveProgress]
  );

  const resetProgress = useCallback(async () => {
    if (!user) return;
    await resetUserProgress(supabase, user.id);
    await loadProgressForUser(user.id);
  }, [supabase, user, loadProgressForUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProgress(null);
    window.location.href = "/";
  }, [supabase]);

  const value: ProgressContextValue = {
    user,
    progress,
    loading,
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
