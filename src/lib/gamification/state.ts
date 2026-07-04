import type { XpEntry } from "@/lib/gamification/xp";
import type { QuestActivity, UserQuestProgress } from "@/lib/gamification/quests";
import { emptyQuestActivity } from "@/lib/gamification/quests";
import { getLocalDateString, getWeekKey } from "@/lib/gamification/xp";

export interface GamificationState {
  xpLedger: XpEntry[];
  dailyQuests: UserQuestProgress[];
  weeklyQuest: UserQuestProgress;
  questActivity: QuestActivity;
  earnedAchievements: string[];
  unlockedCosmetics: string[];
  equippedCosmetic: string | null;
  gauntletBestScore: number;
  totalReviewsCorrect: number;
  perfectLessons: number;
  lastDailyReset: string;
  lastWeeklyReset: string;
}

export const EMPTY_GAMIFICATION: GamificationState = {
  xpLedger: [],
  dailyQuests: [],
  weeklyQuest: { questId: "weekly-consistency", progress: 0, completed: false, claimed: false },
  questActivity: emptyQuestActivity(),
  earnedAchievements: [],
  unlockedCosmetics: [],
  equippedCosmetic: null,
  gauntletBestScore: 0,
  totalReviewsCorrect: 0,
  perfectLessons: 0,
  lastDailyReset: getLocalDateString(),
  lastWeeklyReset: getWeekKey(),
};

const STORAGE_KEY = "ori-gamification";
const LEDGER_MAX = 50;

export function loadGamificationState(): GamificationState {
  if (typeof window === "undefined") return { ...EMPTY_GAMIFICATION };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_GAMIFICATION };
    return { ...EMPTY_GAMIFICATION, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_GAMIFICATION };
  }
}

export function saveGamificationState(state: GamificationState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function appendXpLedger(state: GamificationState, entry: XpEntry): GamificationState {
  return {
    ...state,
    xpLedger: [entry, ...state.xpLedger].slice(0, LEDGER_MAX),
  };
}

export function clearGamificationState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
