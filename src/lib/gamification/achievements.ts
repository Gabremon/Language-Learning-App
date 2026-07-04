export type AchievementCategory = "streak" | "review" | "lesson" | "listening" | "special";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  cosmeticReward?: string;
}

export interface AchievementCheckContext {
  streakCount: number;
  lessonsCompleted: number;
  reviewsCorrect: number;
  perfectLessons: number;
  gauntletBestScore: number;
  hourOfDay: number;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-lesson",
    title: "First Step",
    description: "Complete your first lesson",
    emoji: "🌱",
    category: "lesson",
    cosmeticReward: "frame-bamboo",
  },
  {
    id: "streak-3",
    title: "Three-Day Flame",
    description: "Keep a 3-day streak",
    emoji: "🔥",
    category: "streak",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Keep a 7-day streak",
    emoji: "⚡",
    category: "streak",
    cosmeticReward: "frame-lantern",
  },
  {
    id: "perfect-lesson",
    title: "Tone Tamer",
    description: "Finish a lesson with perfect first-try accuracy",
    emoji: "🎯",
    category: "lesson",
  },
  {
    id: "review-25",
    title: "Recall Runner",
    description: "Get 25 review answers correct",
    emoji: "🔄",
    category: "review",
  },
  {
    id: "gauntlet-10",
    title: "Sharpshooter",
    description: "Build 10 words in one word sprint run",
    emoji: "⚔️",
    category: "special",
    cosmeticReward: "theme-ink-storm",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Complete a lesson after 10 PM",
    emoji: "🦉",
    category: "special",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Complete a lesson before 7 AM",
    emoji: "🐦",
    category: "special",
  },
];

export const COSMETICS: Record<
  string,
  { id: string; name: string; type: "frame" | "theme"; emoji: string }
> = {
  "frame-bamboo": { id: "frame-bamboo", name: "Bamboo Frame", type: "frame", emoji: "🎋" },
  "frame-lantern": { id: "frame-lantern", name: "Red Lantern Frame", type: "frame", emoji: "🏮" },
  "theme-ink-storm": { id: "theme-ink-storm", name: "Ink Storm Theme", type: "theme", emoji: "🌊" },
};

export function checkAchievements(
  earned: string[],
  ctx: AchievementCheckContext
): string[] {
  const newlyEarned: string[] = [];

  const checks: [string, boolean][] = [
    ["first-lesson", ctx.lessonsCompleted >= 1],
    ["streak-3", ctx.streakCount >= 3],
    ["streak-7", ctx.streakCount >= 7],
    ["perfect-lesson", ctx.perfectLessons >= 1],
    ["review-25", ctx.reviewsCorrect >= 25],
    ["gauntlet-10", ctx.gauntletBestScore >= 10],
    ["night-owl", ctx.hourOfDay >= 22],
    ["early-bird", ctx.hourOfDay < 7],
  ];

  for (const [id, condition] of checks) {
    if (condition && !earned.includes(id)) {
      newlyEarned.push(id);
    }
  }

  return newlyEarned;
}

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getCosmeticsFromAchievements(achievementIds: string[]): string[] {
  return achievementIds
    .map((id) => getAchievementById(id)?.cosmeticReward)
    .filter((c): c is string => Boolean(c));
}
