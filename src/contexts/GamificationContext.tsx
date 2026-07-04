"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useProgress } from "@/contexts/ProgressContext";
import type { GamificationState } from "@/lib/gamification/state";
import {
  appendXpLedger,
  clearGamificationState,
  EMPTY_GAMIFICATION,
  loadGamificationState,
  saveGamificationState as saveLocalGamification,
} from "@/lib/gamification/state";
import {
  createXpEntry,
  getLevelFromXp,
  type LevelInfo,
  type XpEntry,
  type XpSource,
} from "@/lib/gamification/xp";
import {
  DAILY_QUESTS,
  buildDailyQuestStates,
  buildWeeklyQuestState,
  isQuestComplete,
  type QuestActivity,
  WEEKLY_QUEST,
} from "@/lib/gamification/quests";
import {
  checkAchievements,
  getCosmeticsFromAchievements,
  getAchievementById,
} from "@/lib/gamification/achievements";
import {
  fetchGamificationState,
  insertXpLedgerEntry,
  resetQuestsIfNeeded,
  saveGamificationState as saveDbGamification,
  touchActiveDay,
} from "@/lib/gamification-db";
import { addXp } from "@/lib/progress";

interface GamificationContextValue {
  state: GamificationState;
  level: LevelInfo;
  loading: boolean;
  recentUnlocks: string[];
  awardXp: (source: XpSource, amount: number, label?: string) => Promise<void>;
  recordLessonComplete: (score: number, total: number) => Promise<void>;
  recordReviewCorrect: () => Promise<void>;
  recordGauntletRun: (wordsBuilt: number, xpEarned: number) => Promise<void>;
  claimQuest: (questId: string) => Promise<void>;
  equipCosmetic: (cosmeticId: string | null) => Promise<void>;
  clearRecentUnlocks: () => void;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const { user, progress, isGuest, saveProgress } = useProgress();
  const [state, setState] = useState<GamificationState>(EMPTY_GAMIFICATION);
  const [loading, setLoading] = useState(true);
  const [recentUnlocks, setRecentUnlocks] = useState<string[]>([]);

  const persist = useCallback(
    async (next: GamificationState) => {
      setState(next);
      if (isGuest || !user) {
        saveLocalGamification(next);
        return;
      }
      await saveDbGamification(supabase, user.id, next);
    },
    [supabase, user, isGuest]
  );

  const awardXp = useCallback(
    async (source: XpSource, amount: number, label?: string) => {
      if (!progress || amount <= 0) return;

      const entry = createXpEntry(source, amount, label);
      const nextState = appendXpLedger(state, entry);
      await persist(nextState);

      const nextProgress = addXp(progress, amount);
      await saveProgress(nextProgress);

      if (!isGuest && user) {
        try {
          await insertXpLedgerEntry(supabase, user.id, entry);
        } catch (err) {
          console.error("[GamificationProvider] xp ledger", err);
        }
      }
    },
    [progress, state, persist, saveProgress, isGuest, user, supabase]
  );

  const processAchievements = useCallback(
    async (nextState: GamificationState, streakCount: number): Promise<GamificationState> => {
      const newly = checkAchievements(nextState.earnedAchievements, {
        streakCount,
        lessonsCompleted: progress?.completedLessonIds.length ?? 0,
        reviewsCorrect: nextState.totalReviewsCorrect,
        perfectLessons: nextState.perfectLessons,
        gauntletBestScore: nextState.gauntletBestScore,
        hourOfDay: new Date().getHours(),
      });

      if (newly.length === 0) return nextState;

      const earned = [...nextState.earnedAchievements, ...newly];
      const cosmetics = getCosmeticsFromAchievements(newly);
      const unlocked = [...new Set([...nextState.unlockedCosmetics, ...cosmetics])];

      setRecentUnlocks(newly);

      let updated = { ...nextState, earnedAchievements: earned, unlockedCosmetics: unlocked };
      for (const id of newly) {
        const ach = getAchievementById(id);
        if (ach) {
          const entry = createXpEntry("achievement", 25, `Badge: ${ach.title}`);
          updated = appendXpLedger(updated, entry);
          if (progress) {
            await saveProgress(addXp(progress, 25));
          }
          if (!isGuest && user) {
            try {
              await insertXpLedgerEntry(supabase, user.id, entry);
            } catch (err) {
              console.error("[GamificationProvider] achievement xp", err);
            }
          }
        }
      }

      return updated;
    },
    [progress, saveProgress, isGuest, user, supabase]
  );

  const recordLessonComplete = useCallback(
    async (score: number, total: number) => {
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      const perfect = score === total;

      let next = touchActiveDay(resetQuestsIfNeeded(state));
      next = {
        ...next,
        questActivity: {
          ...next.questActivity,
          lessonsCompleted: next.questActivity.lessonsCompleted + 1,
          bestLessonAccuracy: Math.max(next.questActivity.bestLessonAccuracy, accuracy),
        },
        perfectLessons: perfect ? next.perfectLessons + 1 : next.perfectLessons,
      };
      next = {
        ...next,
        dailyQuests: buildDailyQuestStates(next.questActivity).map((q) => {
          const prev = next.dailyQuests.find((d) => d.questId === q.questId);
          return prev?.claimed ? { ...q, claimed: true } : q;
        }),
        weeklyQuest: (() => {
          const wq = buildWeeklyQuestState(next.questActivity);
          return next.weeklyQuest.claimed ? { ...wq, claimed: true } : wq;
        })(),
      };

      next = await processAchievements(next, progress?.streakCount ?? 0);
      await persist(next);
    },
    [state, persist, processAchievements, progress]
  );

  const recordReviewCorrect = useCallback(async () => {
    let next = resetQuestsIfNeeded(state);
    next = {
      ...next,
      totalReviewsCorrect: next.totalReviewsCorrect + 1,
      questActivity: {
        ...next.questActivity,
        reviewsCorrect: next.questActivity.reviewsCorrect + 1,
      },
    };
    next = {
      ...next,
      dailyQuests: buildDailyQuestStates(next.questActivity).map((q) => {
        const prev = next.dailyQuests.find((d) => d.questId === q.questId);
        return prev?.claimed ? { ...q, claimed: true } : q;
      }),
    };
    next = (await processAchievements(next, progress?.streakCount ?? 0)) ?? next;
    await persist(next);
  }, [state, persist, processAchievements, progress]);

  const recordGauntletRun = useCallback(
    async (wordsBuilt: number, xpEarned: number) => {
      let next = resetQuestsIfNeeded(state);
      next = {
        ...next,
        gauntletBestScore: Math.max(next.gauntletBestScore, wordsBuilt),
        questActivity: {
          ...next.questActivity,
          gauntletWords: next.questActivity.gauntletWords + wordsBuilt,
        },
      };
      if (xpEarned > 0) {
        await awardXp("gauntlet", xpEarned, `Word sprint: ${wordsBuilt} words`);
      }
      next = await processAchievements(next, progress?.streakCount ?? 0);
      await persist(next);
    },
    [state, persist, processAchievements, progress, awardXp]
  );

  const claimQuest = useCallback(
    async (questId: string) => {
      const quest =
        DAILY_QUESTS.find((q) => q.id === questId) ??
        (WEEKLY_QUEST.id === questId ? WEEKLY_QUEST : null);
      if (!quest || !isQuestComplete(quest, state.questActivity)) return;

      const isWeekly = quest.type === "weekly";
      const alreadyClaimed = isWeekly
        ? state.weeklyQuest.claimed
        : state.dailyQuests.find((q) => q.questId === questId)?.claimed;
      if (alreadyClaimed) return;

      const next = isWeekly
        ? { ...state, weeklyQuest: { ...state.weeklyQuest, claimed: true } }
        : {
            ...state,
            dailyQuests: state.dailyQuests.map((q) =>
              q.questId === questId ? { ...q, claimed: true } : q
            ),
          };

      await persist(next);
      await awardXp(
        isWeekly ? "quest_weekly" : "quest_daily",
        quest.xpReward,
        quest.title
      );
    },
    [state, persist, awardXp]
  );

  const equipCosmetic = useCallback(
    async (cosmeticId: string | null) => {
      if (cosmeticId && !state.unlockedCosmetics.includes(cosmeticId)) return;
      await persist({ ...state, equippedCosmetic: cosmeticId });
    },
    [state, persist]
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        if (user && !isGuest) {
          const data = await fetchGamificationState(supabase, user.id);
          if (mounted) setState(resetQuestsIfNeeded(data));
        } else {
          const local = resetQuestsIfNeeded(loadGamificationState());
          if (mounted) setState(local);
        }
      } catch (err) {
        console.error("[GamificationProvider]", err);
        if (mounted) setState(resetQuestsIfNeeded(loadGamificationState()));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [user, isGuest, supabase]);

  useEffect(() => {
    if (!user) clearGamificationState();
  }, [user]);

  const level = getLevelFromXp(progress?.xp ?? 0);

  const value: GamificationContextValue = {
    state,
    level,
    loading,
    recentUnlocks,
    awardXp,
    recordLessonComplete,
    recordReviewCorrect,
    recordGauntletRun,
    claimQuest,
    equipCosmetic,
    clearRecentUnlocks: () => setRecentUnlocks([]),
  };

  return (
    <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}
