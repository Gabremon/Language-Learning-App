import { XP_VALUES } from "@/lib/gamification/xp";

export type QuestType = "daily" | "weekly";

export interface QuestDefinition {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  target: number;
  metric: QuestMetric;
  xpReward: number;
  order: number;
}

export type QuestMetric =
  | "lessons_completed"
  | "reviews_correct"
  | "review_accuracy"
  | "active_days"
  | "path_steps"
  | "gauntlet_words";

export interface UserQuestProgress {
  questId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export const DAILY_QUESTS: QuestDefinition[] = [
  {
    id: "daily-lesson",
    type: "daily",
    title: "Do one lesson",
    description: "Complete any lesson on the trail",
    target: 1,
    metric: "lessons_completed",
    xpReward: XP_VALUES.questDailyEasy,
    order: 1,
  },
  {
    id: "daily-review",
    type: "daily",
    title: "Review 5 due words",
    description: "Clear words from your review queue",
    target: 5,
    metric: "reviews_correct",
    xpReward: XP_VALUES.questDailyMedium,
    order: 2,
  },
  {
    id: "daily-accuracy",
    type: "daily",
    title: "Score 80%+ in a lesson",
    description: "Finish a lesson with strong first-try accuracy",
    target: 80,
    metric: "review_accuracy",
    xpReward: XP_VALUES.questDailyHard,
    order: 3,
  },
];

export const WEEKLY_QUEST: QuestDefinition = {
  id: "weekly-consistency",
  type: "weekly",
  title: "Keep Ori moving for 5 days",
  description: "Learn on 5 different days this week",
  target: 5,
  metric: "active_days",
  xpReward: XP_VALUES.questWeekly,
  order: 1,
};

export interface QuestActivity {
  lessonsCompleted: number;
  reviewsCorrect: number;
  bestLessonAccuracy: number;
  activeDays: string[];
  gauntletWords: number;
}

export function emptyQuestActivity(): QuestActivity {
  return {
    lessonsCompleted: 0,
    reviewsCorrect: 0,
    bestLessonAccuracy: 0,
    activeDays: [],
    gauntletWords: 0,
  };
}

export function getQuestProgress(
  quest: QuestDefinition,
  activity: QuestActivity
): number {
  switch (quest.metric) {
    case "lessons_completed":
      return activity.lessonsCompleted;
    case "reviews_correct":
      return activity.reviewsCorrect;
    case "review_accuracy":
      return activity.bestLessonAccuracy;
    case "active_days":
      return activity.activeDays.length;
    case "path_steps":
      return activity.lessonsCompleted;
    case "gauntlet_words":
      return activity.gauntletWords;
    default:
      return 0;
  }
}

export function isQuestComplete(quest: QuestDefinition, activity: QuestActivity): boolean {
  return getQuestProgress(quest, activity) >= quest.target;
}

export function buildDailyQuestStates(
  activity: QuestActivity
): UserQuestProgress[] {
  return DAILY_QUESTS.map((quest) => {
    const progress = getQuestProgress(quest, activity);
    return {
      questId: quest.id,
      progress,
      completed: progress >= quest.target,
      claimed: false,
    };
  });
}

export function buildWeeklyQuestState(activity: QuestActivity): UserQuestProgress {
  const progress = getQuestProgress(WEEKLY_QUEST, activity);
  return {
    questId: WEEKLY_QUEST.id,
    progress,
    completed: progress >= WEEKLY_QUEST.target,
    claimed: false,
  };
}

/** Recompute quest progress while preserving claimed flags. */
export function mergeDailyQuestStates(
  activity: QuestActivity,
  existing: UserQuestProgress[]
): UserQuestProgress[] {
  return buildDailyQuestStates(activity).map((quest) => {
    const prev = existing.find((item) => item.questId === quest.questId);
    return prev?.claimed ? { ...quest, claimed: true } : quest;
  });
}

export function mergeWeeklyQuestState(
  activity: QuestActivity,
  existing: UserQuestProgress
): UserQuestProgress {
  const next = buildWeeklyQuestState(activity);
  return existing.claimed ? { ...next, claimed: true } : next;
}

export function markDailyQuestClaimed(
  state: { questActivity: QuestActivity; dailyQuests: UserQuestProgress[] },
  questId: string
): UserQuestProgress[] {
  return mergeDailyQuestStates(state.questActivity, state.dailyQuests).map((quest) =>
    quest.questId === questId ? { ...quest, claimed: true } : quest
  );
}

export function recordActiveDay(activity: QuestActivity, date: string): QuestActivity {
  if (activity.activeDays.includes(date)) return activity;
  return { ...activity, activeDays: [...activity.activeDays, date] };
}
