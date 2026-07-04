/** Lightweight course section metadata — safe for client components (no vocab/lesson payloads). */

export type CourseSectionId =
  | "starter"
  | "hsk1"
  | "hsk2"
  | "hsk3"
  | "hsk4"
  | "hsk5"
  | "hsk6";

export interface CourseSection {
  id: CourseSectionId;
  title: string;
  subtitle: string;
  target: string;
}

export const COURSE_SECTIONS: CourseSection[] = [
  {
    id: "starter",
    title: "Starter",
    subtitle: "Pinyin, tones & survival phrases",
    target: "Sound system + first phrases (included in HSK 1 vocabulary)",
  },
  {
    id: "hsk1",
    title: "HSK 1",
    subtitle: "Complete beginner Mandarin",
    target: "274 words · full HSK 1 coverage · graduation exam",
  },
  {
    id: "hsk2",
    title: "HSK 2",
    subtitle: "Daily life, health & travel",
    target: "500 words · directions, hobbies, school/work basics",
  },
  {
    id: "hsk3",
    title: "HSK 3",
    subtitle: "Community & conversation",
    target: "1,000 words · experiences, plans, opinions",
  },
  {
    id: "hsk4",
    title: "HSK 4",
    subtitle: "Independent communication",
    target: "2,000 words · housing, career, narration",
  },
  {
    id: "hsk5",
    title: "HSK 5",
    subtitle: "Advanced topics",
    target: "Business, society, science & arts",
  },
  {
    id: "hsk6",
    title: "HSK 6",
    subtitle: "Near-native proficiency",
    target: "Academic, legal, media & abstract discourse",
  },
];

/** Unit IDs grouped by section — used by client views without loading full course data. */
export const UNIT_IDS_BY_SECTION: Record<CourseSectionId, string[]> = {
  starter: ["unit-sa", "unit-sb"],
  hsk1: [
    "unit-h1-social",
    "unit-h1-people",
    "unit-h1-family",
    "unit-h1-numbers",
    "unit-h1-time",
    "unit-h1-routine",
    "unit-h1-food",
    "unit-h1-drinks",
    "unit-h1-restaurant",
    "unit-h1-shopping",
    "unit-h1-money",
    "unit-h1-places",
    "unit-h1-directions",
    "unit-h1-transport",
    "unit-h1-weather",
    "unit-h1-home",
    "unit-h1-verbs",
    "unit-h1-adjectives",
    "unit-h1-final",
  ],
  hsk2: ["unit-h2-dla", "unit-h2-dlb", "unit-h2-dlc", "unit-h2-dld"],
  hsk3: ["unit-h3-ca", "unit-h3-cb", "unit-h3-cc", "unit-h3-cd", "unit-h3-ce"],
  hsk4: ["unit-h4-ia", "unit-h4-ib", "unit-h4-ic", "unit-h4-id", "unit-h4-ie"],
  hsk5: ["unit-h5-aa", "unit-h5-ab", "unit-h5-ac", "unit-h5-ad", "unit-h5-ae"],
  hsk6: ["unit-h6-aa", "unit-h6-ab", "unit-h6-ac", "unit-h6-ad", "unit-h6-ae"],
};

export function getUnitIdsForSection(
  sectionId: CourseSectionId,
  catalogUnits?: { id: string; orderIndex: number }[]
): string[] {
  if (sectionId === "starter" || sectionId === "hsk1") {
    return UNIT_IDS_BY_SECTION[sectionId];
  }

  if (catalogUnits?.length) {
    const level = sectionId.replace("hsk", "");
    const prefix = `unit-h${level}-`;
    return catalogUnits
      .filter((unit) => unit.id.startsWith(prefix))
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((unit) => unit.id);
  }

  return UNIT_IDS_BY_SECTION[sectionId] ?? [];
}

export function getSectionIdForUnit(
  unitId: string,
  catalogUnits?: { id: string; orderIndex: number }[]
): CourseSectionId | null {
  for (const section of COURSE_SECTIONS) {
    if (getUnitIdsForSection(section.id, catalogUnits).includes(unitId)) {
      return section.id;
    }
  }
  return null;
}

export const SECTION_STYLES = {
  starter: {
    paper: "from-amber-50/80 via-orange-50/40 to-white",
    border: "border-amber-200/60",
    accent: "#D97706",
    glyph: "起",
  },
  hsk1: {
    paper: "from-sky-50/80 via-brand-50/40 to-white",
    border: "border-brand-200/60",
    accent: "#0284C7",
    glyph: "一",
  },
  hsk2: {
    paper: "from-emerald-50/80 via-teal-50/40 to-white",
    border: "border-emerald-200/60",
    accent: "#059669",
    glyph: "二",
  },
  hsk3: {
    paper: "from-violet-50/80 via-purple-50/40 to-white",
    border: "border-violet-200/60",
    accent: "#7C3AED",
    glyph: "三",
  },
  hsk4: {
    paper: "from-rose-50/80 via-pink-50/40 to-white",
    border: "border-rose-200/60",
    accent: "#E11D48",
    glyph: "四",
  },
  hsk5: {
    paper: "from-indigo-50/80 via-blue-50/40 to-white",
    border: "border-indigo-200/60",
    accent: "#4F46E5",
    glyph: "五",
  },
  hsk6: {
    paper: "from-stone-100/80 via-stone-50/40 to-white",
    border: "border-stone-300/60",
    accent: "#57534E",
    glyph: "六",
  },
} as const;
