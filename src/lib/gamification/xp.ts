export type XpSource =
  | "lesson_complete"
  | "lesson_perfect"
  | "review_correct"
  | "quest_daily"
  | "quest_weekly"
  | "achievement"
  | "gauntlet"
  | "gauntlet_combo";

export interface XpEntry {
  id: string;
  source: XpSource;
  amount: number;
  label: string;
  createdAt: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPct: number;
}

export const XP_VALUES = {
  lessonPerCorrect: 10,
  lessonPerfectBonus: 20,
  reviewCorrect: 5,
  questDailyEasy: 15,
  questDailyMedium: 25,
  questDailyHard: 40,
  questWeekly: 100,
  gauntletPerWord: 8,
  gauntletComboBonus: 5,
} as const;

export const XP_SOURCE_LABELS: Record<XpSource, string> = {
  lesson_complete: "Lesson complete",
  lesson_perfect: "Perfect lesson bonus",
  review_correct: "Review correct",
  quest_daily: "Daily quest",
  quest_weekly: "Weekly quest",
  achievement: "Achievement unlocked",
  gauntlet: "Word sprint",
  gauntlet_combo: "Combo bonus",
};

const LEVEL_TITLES = [
  "Trail Beginner",
  "Pinyin Scout",
  "Tone Tamer",
  "Hanzi Hand",
  "Tea House Traveler",
  "Scroll Keeper",
  "Path Walker",
  "Mandarin Voyager",
  "Seal Seeker",
  "Ori Master",
] as const;

/** XP required to reach each level (cumulative thresholds). */
function xpThresholdForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(50 * Math.pow(level - 1, 1.4));
}

export function getLevelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  while (xpThresholdForLevel(level + 1) <= totalXp && level < 99) {
    level++;
  }

  const xpForCurrentLevel = xpThresholdForLevel(level);
  const xpForNextLevel = xpThresholdForLevel(level + 1);
  const span = xpForNextLevel - xpForCurrentLevel;
  const progressPct = span > 0 ? Math.round(((totalXp - xpForCurrentLevel) / span) * 100) : 100;

  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    currentXp: totalXp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPct,
  };
}

export function createXpEntry(
  source: XpSource,
  amount: number,
  label?: string
): XpEntry {
  return {
    id: `xp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    source,
    amount,
    label: label ?? XP_SOURCE_LABELS[source],
    createdAt: new Date().toISOString(),
  };
}

export function getXpForLesson(score: number, totalQuestions: number): number {
  const base = score * XP_VALUES.lessonPerCorrect;
  const bonus = score === totalQuestions ? XP_VALUES.lessonPerfectBonus : 0;
  return base + bonus;
}

export function getLocalDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getWeekKey(date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return getLocalDateString(d);
}
