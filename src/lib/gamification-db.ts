import type { SupabaseClient } from "@supabase/supabase-js";
import type { GamificationState } from "@/lib/gamification/state";
import type { XpEntry } from "@/lib/gamification/xp";
import {
  buildDailyQuestStates,
  buildWeeklyQuestState,
  mergeDailyQuestStates,
  mergeWeeklyQuestState,
  emptyQuestActivity,
  recordActiveDay,
} from "@/lib/gamification/quests";
import { getLocalDateString, getWeekKey } from "@/lib/gamification/xp";
import { EMPTY_GAMIFICATION } from "@/lib/gamification/state";

function parseGamificationRow(row: Record<string, unknown>): GamificationState {
  return {
    ...EMPTY_GAMIFICATION,
    earnedAchievements: (row.earned_achievements as string[]) ?? [],
    unlockedCosmetics: (row.unlocked_cosmetics as string[]) ?? [],
    equippedCosmetic: (row.equipped_cosmetic as string | null) ?? null,
    gauntletBestScore: (row.gauntlet_best_score as number) ?? 0,
    totalReviewsCorrect: (row.total_reviews_correct as number) ?? 0,
    perfectLessons: (row.perfect_lessons as number) ?? 0,
    questActivity: {
      ...emptyQuestActivity(),
      ...((row.quest_activity_json as object) ?? {}),
    },
    dailyQuests: (row.daily_quests_json as GamificationState["dailyQuests"]) ?? [],
    weeklyQuest:
      (row.weekly_quest_json as GamificationState["weeklyQuest"]) ??
      EMPTY_GAMIFICATION.weeklyQuest,
    lastDailyReset: (row.last_daily_reset as string) ?? getLocalDateString(),
    lastWeeklyReset: (row.last_weekly_reset as string) ?? getWeekKey(),
    xpLedger: [],
  };
}

function isMissingTableError(message: string): boolean {
  return (
    message.includes("does not exist") ||
    message.includes("Could not find the table") ||
    message.includes("schema cache")
  );
}

export async function fetchGamificationState(
  supabase: SupabaseClient,
  userId: string
): Promise<GamificationState> {
  const [gamRes, ledgerRes] = await Promise.all([
    supabase.from("user_gamification").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("xp_ledger")
      .select("id, source, amount, label, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (gamRes.error && !isMissingTableError(gamRes.error.message)) {
    throw new Error(gamRes.error.message);
  }
  if (ledgerRes.error && !isMissingTableError(ledgerRes.error.message)) {
    throw new Error(ledgerRes.error.message);
  }

  const base = gamRes.data ? parseGamificationRow(gamRes.data) : { ...EMPTY_GAMIFICATION };

  base.xpLedger = (ledgerRes.data ?? []).map((row) => ({
    id: row.id,
    source: row.source as XpEntry["source"],
    amount: row.amount,
    label: row.label,
    createdAt: row.created_at,
  }));

  return base;
}

export async function saveGamificationState(
  supabase: SupabaseClient,
  userId: string,
  state: GamificationState
): Promise<void> {
  const { error } = await supabase.from("user_gamification").upsert(
    {
      user_id: userId,
      earned_achievements: state.earnedAchievements,
      unlocked_cosmetics: state.unlockedCosmetics,
      equipped_cosmetic: state.equippedCosmetic,
      gauntlet_best_score: state.gauntletBestScore,
      total_reviews_correct: state.totalReviewsCorrect,
      perfect_lessons: state.perfectLessons,
      quest_activity_json: state.questActivity,
      daily_quests_json: state.dailyQuests,
      weekly_quest_json: state.weeklyQuest,
      last_daily_reset: state.lastDailyReset,
      last_weekly_reset: state.lastWeeklyReset,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error && !isMissingTableError(error.message)) throw new Error(error.message);
}

export async function insertXpLedgerEntry(
  supabase: SupabaseClient,
  userId: string,
  entry: XpEntry
): Promise<void> {
  const { error } = await supabase.from("xp_ledger").insert({
    user_id: userId,
    source: entry.source,
    amount: entry.amount,
    label: entry.label,
  });

  if (error && !isMissingTableError(error.message)) throw new Error(error.message);
}

export function resetQuestsIfNeeded(state: GamificationState): GamificationState {
  const today = getLocalDateString();
  const week = getWeekKey();
  let next = state;

  if (state.lastDailyReset !== today) {
    next = {
      ...next,
      lastDailyReset: today,
      questActivity: emptyQuestActivity(),
      dailyQuests: buildDailyQuestStates(emptyQuestActivity()),
    };
  } else if (next.dailyQuests.length === 0) {
    next = {
      ...next,
      dailyQuests: buildDailyQuestStates(next.questActivity),
    };
  }

  if (state.lastWeeklyReset !== week) {
    next = {
      ...next,
      lastWeeklyReset: week,
      weeklyQuest: buildWeeklyQuestState(emptyQuestActivity()),
      questActivity: { ...next.questActivity, activeDays: [] },
    };
  } else if (!next.weeklyQuest?.questId) {
    next = {
      ...next,
      weeklyQuest: buildWeeklyQuestState(next.questActivity),
    };
  }

  return next;
}

export function touchActiveDay(state: GamificationState): GamificationState {
  const today = getLocalDateString();
  const questActivity = recordActiveDay(state.questActivity, today);
  return {
    ...state,
    questActivity,
    dailyQuests: mergeDailyQuestStates(questActivity, state.dailyQuests),
    weeklyQuest: mergeWeeklyQuestState(questActivity, state.weeklyQuest),
  };
}
