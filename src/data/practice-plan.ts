export type PracticeBand = "starter" | "hsk1" | "all";

export type PracticeCategory =
  | "tone"
  | "listening"
  | "typing"
  | "character"
  | "speaking"
  | "review"
  | "immersion";

export interface PracticeActivity {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: PracticeCategory;
  bands: PracticeBand[];
  steps: string[];
  /** Optional in-app link */
  href?: string;
  tips?: string[];
}

export interface DailyPracticeBlock {
  id: string;
  timeLabel: string;
  title: string;
  activities: string[];
}

export interface WeeklyPracticePlan {
  band: PracticeBand;
  label: string;
  summary: string;
  dailyMinutes: number;
  weeklyGoal: string;
  dailyBlocks: DailyPracticeBlock[];
  activityIds: string[];
}

const CATEGORY_LABELS: Record<PracticeCategory, string> = {
  tone: "Tone drills",
  listening: "Listening",
  typing: "Typing & production",
  character: "Characters",
  speaking: "Speaking aloud",
  review: "Spaced review",
  immersion: "Real-world use",
};

export function getCategoryLabel(category: PracticeCategory): string {
  return CATEGORY_LABELS[category];
}

export const practiceActivities: PracticeActivity[] = [
  {
    id: "tone-minimal-pairs",
    title: "Tone minimal pairs",
    description: "Train your ear on the four tones using high-frequency syllables before free production.",
    durationMinutes: 5,
    category: "tone",
    bands: ["starter", "hsk1", "all"],
    steps: [
      "Listen to 妈 mā (tone 1) and 骂 mà (tone 4) — notice the pitch contour.",
      "Repeat each pair slowly: 八 bā / 拔 bá, 马 mǎ / 麻 má.",
      "Shadow full phrases: 你好 nǐ hǎo, 老师 lǎoshī, 谢谢 xièxie.",
      "Quiz yourself: cover the pinyin and guess the tone from audio.",
    ],
    tips: ["Use headphones.", "Exaggerate tones at first — accuracy comes before speed."],
  },
  {
    id: "tone-phrase-shadow",
    title: "Phrase shadowing",
    description: "Shadow short greetings and classroom phrases to link tones with natural rhythm.",
    durationMinutes: 5,
    category: "tone",
    bands: ["starter", "all"],
    steps: [
      "Play 你好！ and repeat immediately, matching pitch.",
      "Shadow 我叫… with your own name substituted.",
      "Shadow 你是学生吗？ with natural question intonation.",
      "Record yourself and compare to the model.",
    ],
  },
  {
    id: "listening-dialogue",
    title: "Micro-dialogue listening",
    description: "Comprehend short exchanges using only vocabulary from your current band.",
    durationMinutes: 8,
    category: "listening",
    bands: ["starter", "hsk1", "all"],
    steps: [
      "Pick 3 sentences from a lesson you finished this week.",
      "Listen once without text — write what you understood in English.",
      "Listen again with hanzi visible — note any gaps.",
      "Replay line by line and shadow the speaker.",
    ],
    href: "/vocabulary",
  },
  {
    id: "srs-review",
    title: "Spaced repetition review",
    description: "Retrieve vocabulary from memory — the highest-impact daily habit outside lessons.",
    durationMinutes: 10,
    category: "review",
    bands: ["starter", "hsk1", "all"],
    steps: [
      "Open Review and clear all due items.",
      "Say each word aloud before tapping the answer.",
      "For wrong items, write the hanzi once before continuing.",
      "Finish with 5 random words from your weakest unit.",
    ],
    href: "/review",
    tips: ["Prioritize production (say it) over recognition only."],
  },
  {
    id: "pinyin-typing",
    title: "Pinyin-to-hanzi typing",
    description: "Build real-world input fluency using your device Chinese keyboard.",
    durationMinutes: 8,
    category: "typing",
    bands: ["starter", "hsk1", "all"],
    steps: [
      "Switch to Chinese pinyin input on your phone or computer.",
      "Type these from memory: 你好, 学生, 中国, 妈妈, 谢谢.",
      "Type 5 family words: 爸爸, 哥哥, 妹妹, 朋友, 家人.",
      "Type one sentence: 我是学生。 or 我喜欢喝茶。",
    ],
    tips: ["Don't copy-paste — retrieval is the practice."],
  },
  {
    id: "hanzi-recognition",
    title: "Character recognition drill",
    description: "Link form, sound, and meaning for high-frequency characters.",
    durationMinutes: 7,
    category: "character",
    bands: ["hsk1", "all"],
    steps: [
      "From the Words page, filter mentally to this week's new characters.",
      "Cover the pinyin — read each hanzi aloud.",
      "Cover the English — write the meaning from memory.",
      "Group characters by radical: 女 (妈妈, 姐姐), 口 (叫, 吃), 氵 (水, 没).",
    ],
    href: "/vocabulary",
  },
  {
    id: "self-intro-drill",
    title: "45-second self-introduction",
    description: "Combine Starter + HSK 1 phrases into a fluent intro — the Starter B checkpoint task.",
    durationMinutes: 5,
    category: "speaking",
    bands: ["starter", "hsk1", "all"],
    steps: [
      "你好！我叫 [name]。",
      "我是 [nationality]人。我是学生。",
      "我来自 [country]。",
      "我的家有 [number] 个人。",
      "Deliver the full intro in one take without pausing more than 2 seconds.",
    ],
  },
  {
    id: "family-tree",
    title: "Family tree speaking",
    description: "Describe your family using 的 possession — Foundation A checkpoint practice.",
    durationMinutes: 6,
    category: "speaking",
    bands: ["hsk1", "all"],
    steps: [
      "Draw a simple family tree (stick figures are fine).",
      "Point to each person and say: 这是我的爸爸/妈妈/哥哥…",
      "Add occupations: 我的妈妈是老师。",
      "Ask imaginary questions: 你有妹妹吗？",
    ],
  },
  {
    id: "daily-routine-narration",
    title: "Daily routine timeline",
    description: "Walk through your day using time words — Foundation B checkpoint practice.",
    durationMinutes: 7,
    category: "speaking",
    bands: ["hsk1", "all"],
    steps: [
      "Write times: 7点起床, 8点上学, 12点吃午饭…",
      "Say each line aloud with 我七点起床 pattern.",
      "Add 今天 / 明天: 明天我七点起床。",
      "Record a 30-second routine narration.",
    ],
  },
  {
    id: "ordering-roleplay",
    title: "Restaurant ordering role-play",
    description: "Practice ordering food aloud — Foundation C checkpoint task.",
    durationMinutes: 8,
    category: "immersion",
    bands: ["hsk1", "all"],
    steps: [
      "Role A (customer): 你好！我要饺子和茶。",
      "Role B (server): 好的。你还要米饭吗？",
      "Practice 请给我… and 买单.",
      "Swap roles and add 我喜欢/不喜欢.",
    ],
  },
  {
    id: "shopping-dialogue",
    title: "Shopping & bargaining",
    description: "Ask prices and make choices — Foundation D vocabulary in context.",
    durationMinutes: 8,
    category: "immersion",
    bands: ["hsk1", "all"],
    steps: [
      "这个多少钱？ — practice pointing at imaginary items.",
      "太贵了！便宜一点儿吧？",
      "我要这个，不要那个。",
      "Scenario: buy fruit at a supermarket — list 3 items in Chinese.",
    ],
  },
  {
    id: "weather-transit",
    title: "Weather & directions",
    description: "Combine weather and transport phrases for real-world survival.",
    durationMinutes: 6,
    category: "immersion",
    bands: ["hsk1", "all"],
    steps: [
      "Describe today's weather: 今天天气很冷。",
      "Plan a trip: 我明天去车站。",
      "Ask: 地铁站怎么走？",
      "Listen to a weather phrase and repeat with emotion (cold = shiver!).",
    ],
  },
  {
    id: "weekly-checkpoint",
    title: "Weekly unit checkpoint",
    description: "End-of-week cumulative check — mirrors in-app unit checkpoints.",
    durationMinutes: 15,
    category: "review",
    bands: ["starter", "hsk1", "all"],
    steps: [
      "Review all vocabulary from the current unit (Words page).",
      "Complete any due SRS items.",
      "Do one speaking task from this unit's checkpoint list.",
      "Re-do one lesson from the unit if score was below 80%.",
    ],
    href: "/course",
  },
  {
    id: "hsk1-graduation-prep",
    title: "HSK 1 graduation rehearsal",
    description: "Full-band integration practice before the HSK 1 graduation lesson.",
    durationMinutes: 20,
    category: "immersion",
    bands: ["hsk1"],
    steps: [
      "Self-intro (45 sec): name, nationality, student status, family.",
      "Order lunch in Chinese (written + spoken).",
      "Ask where the station is and describe the weather.",
      "Type a 25-character message: 你好！我是学生。我喜欢喝茶。",
      "Complete HSK 1 Band Graduation lesson in the app.",
    ],
    href: "/course",
  },
];

export const weeklyPlans: WeeklyPracticePlan[] = [
  {
    band: "starter",
    label: "Starter band",
    summary: "Focus on sound, tones, and survival phrases. Keep sessions short and daily.",
    dailyMinutes: 15,
    weeklyGoal: "Hear Mandarin clearly, greet people, count to 10, and type your name.",
    dailyBlocks: [
      { id: "am", timeLabel: "Morning (5 min)", title: "Tone warm-up", activities: ["tone-minimal-pairs"] },
      { id: "mid", timeLabel: "After a lesson (10 min)", title: "Lock in new words", activities: ["srs-review", "pinyin-typing"] },
      { id: "eve", timeLabel: "Evening (5 min)", title: "Shadow & speak", activities: ["tone-phrase-shadow", "self-intro-drill"] },
    ],
    activityIds: [
      "tone-minimal-pairs",
      "tone-phrase-shadow",
      "srs-review",
      "pinyin-typing",
      "listening-dialogue",
      "self-intro-drill",
      "weekly-checkpoint",
    ],
  },
  {
    band: "hsk1",
    label: "HSK 1 band",
    summary: "Balance recognition, typing, and short spoken tasks across family, time, food, and shopping topics.",
    dailyMinutes: 20,
    weeklyGoal: "Hold a basic conversation: intro, family, time, food order, and simple shopping.",
    dailyBlocks: [
      { id: "am", timeLabel: "Morning (5 min)", title: "Tone maintenance", activities: ["tone-minimal-pairs"] },
      { id: "mid", timeLabel: "After a lesson (12 min)", title: "Deep practice", activities: ["srs-review", "hanzi-recognition", "pinyin-typing"] },
      { id: "eve", timeLabel: "Evening (8 min)", title: "Speak & apply", activities: ["listening-dialogue", "family-tree", "ordering-roleplay"] },
    ],
    activityIds: [
      "tone-minimal-pairs",
      "srs-review",
      "hanzi-recognition",
      "pinyin-typing",
      "listening-dialogue",
      "family-tree",
      "daily-routine-narration",
      "ordering-roleplay",
      "shopping-dialogue",
      "weather-transit",
      "weekly-checkpoint",
      "hsk1-graduation-prep",
    ],
  },
  {
    band: "all",
    label: "Full Starter + HSK 1",
    summary: "Complete daily routine while working through both bands.",
    dailyMinutes: 20,
    weeklyGoal: "5 lessons/week + daily SRS + one speaking task per day.",
    dailyBlocks: [
      { id: "am", timeLabel: "Morning (5 min)", title: "Tone & listen", activities: ["tone-minimal-pairs", "listening-dialogue"] },
      { id: "mid", timeLabel: "Midday (10 min)", title: "Review & type", activities: ["srs-review", "pinyin-typing", "hanzi-recognition"] },
      { id: "eve", timeLabel: "Evening (5–10 min)", title: "Speak it", activities: ["self-intro-drill", "ordering-roleplay", "shopping-dialogue"] },
    ],
    activityIds: practiceActivities.map((a) => a.id),
  },
];

export function getActivitiesForBand(band: PracticeBand): PracticeActivity[] {
  return practiceActivities.filter((a) => a.bands.includes(band) || a.bands.includes("all"));
}

export function getActivityById(id: string): PracticeActivity | undefined {
  return practiceActivities.find((a) => a.id === id);
}

export function getWeeklyPlan(band: PracticeBand): WeeklyPracticePlan {
  return weeklyPlans.find((p) => p.band === band) ?? weeklyPlans[2];
}

/** Infer practice focus from course progress (Starter = first 20 lessons). */
export function inferPracticeBand(completedLessonCount: number): PracticeBand {
  if (completedLessonCount < 20) return "starter";
  return "hsk1";
}

export interface GuidedStep {
  id: string;
  blockId: string;
  blockLabel: string;
  blockTitle: string;
  activityId: string;
  activityTitle: string;
  activityDescription: string;
  stepIndex: number;
  stepText: string;
  totalStepsInActivity: number;
  href?: string;
  category: PracticeCategory;
  durationMinutes: number;
  tips?: string[];
}

/** Flat ordered checklist for today's guided session. */
export function getGuidedSteps(band: PracticeBand): GuidedStep[] {
  const plan = getWeeklyPlan(band);
  const steps: GuidedStep[] = [];

  for (const block of plan.dailyBlocks) {
    for (const activityId of block.activities) {
      const activity = getActivityById(activityId);
      if (!activity) continue;

      activity.steps.forEach((stepText, stepIndex) => {
        steps.push({
          id: `${activityId}-${stepIndex}`,
          blockId: block.id,
          blockLabel: block.timeLabel,
          blockTitle: block.title,
          activityId,
          activityTitle: activity.title,
          activityDescription: activity.description,
          stepIndex,
          stepText,
          totalStepsInActivity: activity.steps.length,
          href: stepIndex === activity.steps.length - 1 ? activity.href : undefined,
          category: activity.category,
          durationMinutes: activity.durationMinutes,
          tips: stepIndex === 0 ? activity.tips : undefined,
        });
      });
    }
  }

  return steps;
}

export function getSessionSummary(band: PracticeBand) {
  const plan = getWeeklyPlan(band);
  const steps = getGuidedSteps(band);
  return {
    plan,
    steps,
    totalSteps: steps.length,
    dailyMinutes: plan.dailyMinutes,
  };
}
