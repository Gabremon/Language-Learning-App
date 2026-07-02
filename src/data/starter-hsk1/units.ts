import type { Unit } from "@/types/course";
import { COURSE_ID } from "./constants";

export type CourseSectionId = "starter" | "hsk1";

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
];

export interface UnitDef {
  id: string;
  sectionId: CourseSectionId;
  title: string;
  orderIndex: number;
}

export const UNIT_DEFS: UnitDef[] = [
  { id: "unit-sa", sectionId: "starter", title: "Sounds & Greetings", orderIndex: 1 },
  { id: "unit-sb", sectionId: "starter", title: "Numbers & Identity", orderIndex: 2 },
  { id: "unit-h1-social", sectionId: "hsk1", title: "Social Chinese", orderIndex: 3 },
  { id: "unit-h1-people", sectionId: "hsk1", title: "People & Pronouns", orderIndex: 4 },
  { id: "unit-h1-family", sectionId: "hsk1", title: "Family & Pets", orderIndex: 5 },
  { id: "unit-h1-numbers", sectionId: "hsk1", title: "Numbers & Measures", orderIndex: 6 },
  { id: "unit-h1-time", sectionId: "hsk1", title: "Time & Calendar", orderIndex: 7 },
  { id: "unit-h1-routine", sectionId: "hsk1", title: "Daily Routine", orderIndex: 8 },
  { id: "unit-h1-food", sectionId: "hsk1", title: "Food", orderIndex: 9 },
  { id: "unit-h1-drinks", sectionId: "hsk1", title: "Drinks", orderIndex: 10 },
  { id: "unit-h1-restaurant", sectionId: "hsk1", title: "Restaurants", orderIndex: 11 },
  { id: "unit-h1-shopping", sectionId: "hsk1", title: "Shopping", orderIndex: 12 },
  { id: "unit-h1-money", sectionId: "hsk1", title: "Money & Prices", orderIndex: 13 },
  { id: "unit-h1-places", sectionId: "hsk1", title: "Places in Town", orderIndex: 14 },
  { id: "unit-h1-directions", sectionId: "hsk1", title: "Directions & Location", orderIndex: 15 },
  { id: "unit-h1-transport", sectionId: "hsk1", title: "Transport & Travel", orderIndex: 16 },
  { id: "unit-h1-weather", sectionId: "hsk1", title: "Weather", orderIndex: 17 },
  { id: "unit-h1-home", sectionId: "hsk1", title: "Home & Objects", orderIndex: 18 },
  { id: "unit-h1-verbs", sectionId: "hsk1", title: "Common Verbs", orderIndex: 19 },
  { id: "unit-h1-adjectives", sectionId: "hsk1", title: "Descriptions", orderIndex: 20 },
  { id: "unit-h1-final", sectionId: "hsk1", title: "HSK 1 Graduation", orderIndex: 21 },
];

export const units: Unit[] = UNIT_DEFS.map((u) => ({
  id: u.id,
  courseId: COURSE_ID,
  title: u.title,
  orderIndex: u.orderIndex,
}));

export const HSK_BAND_LABELS: Record<string, string> = Object.fromEntries(
  UNIT_DEFS.map((u) => [u.id, u.sectionId === "starter" ? "Starter" : "HSK 1"])
);

export const UNIT_SECTION: Record<string, CourseSectionId> = Object.fromEntries(
  UNIT_DEFS.map((u) => [u.id, u.sectionId])
);

export function getSectionForUnit(unitId: string): CourseSectionId {
  return UNIT_SECTION[unitId] ?? "hsk1";
}

export function getUnitsForSection(sectionId: CourseSectionId): UnitDef[] {
  return UNIT_DEFS.filter((u) => u.sectionId === sectionId);
}
