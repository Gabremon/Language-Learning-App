import type { Course, Lesson, Sentence, Unit, VocabItem } from "@/types/course";
import {
  COURSE_ID,
  COURSE_SECTIONS as STARTER_SECTIONS,
  HSK_BAND_LABELS as STARTER_BAND_LABELS,
  UNIT_SECTION as STARTER_UNIT_SECTION,
  course,
  units as starterUnits,
  lessons as starterLessons,
  vocabItems as starterVocab,
  sentences as starterSentences,
  lessonVocabMap as starterLessonVocabMap,
  lessonSentenceMap as starterLessonSentenceMap,
  LESSON_COUNT as STARTER_LESSON_COUNT_VALUE,
  LESSONS_PER_UNIT as STARTER_LESSONS_PER_UNIT,
  HSK1_LESSON_COUNT,
  STARTER_LESSON_COUNT,
  VOCAB_COUNT as STARTER_VOCAB_COUNT,
  getSectionForUnit as starterGetSectionForUnit,
  getUnitsForSection as starterGetUnitsForSection,
} from "./starter-hsk1";
import {
  hskAdvancedUnits,
  hskAdvancedLessons,
  hskAdvancedVocabItems,
  hskAdvancedSentences,
  hskAdvancedLessonVocabMap,
  hskAdvancedLessonSentenceMap,
  HSK_ADVANCED_LESSON_COUNT,
  HSK_ADVANCED_VOCAB_COUNT,
} from "./generated/hsk-advanced";

import type { CourseSectionId } from "./course-sections";

export { COURSE_ID, course };
export { COURSE_SECTIONS, type CourseSectionId } from "./course-sections";

function sectionForHskUnit(unitId: string): CourseSectionId {
  if (unitId.startsWith("unit-h2")) return "hsk2";
  if (unitId.startsWith("unit-h3")) return "hsk3";
  if (unitId.startsWith("unit-h4")) return "hsk4";
  if (unitId.startsWith("unit-h5")) return "hsk5";
  if (unitId.startsWith("unit-h6")) return "hsk6";
  return "hsk1";
}

export const units: Unit[] = [...starterUnits, ...hskAdvancedUnits];

export const lessons: Lesson[] = [...starterLessons, ...hskAdvancedLessons];

export const vocabItems: VocabItem[] = [...starterVocab, ...hskAdvancedVocabItems];

export const sentences: Sentence[] = [...starterSentences, ...hskAdvancedSentences];

export const lessonVocabMap: Record<string, string[]> = {
  ...starterLessonVocabMap,
  ...hskAdvancedLessonVocabMap,
};

export const lessonSentenceMap: Record<string, string[]> = {
  ...starterLessonSentenceMap,
  ...hskAdvancedLessonSentenceMap,
};

export const LESSON_COUNT = STARTER_LESSON_COUNT_VALUE + HSK_ADVANCED_LESSON_COUNT;
export const VOCAB_COUNT = STARTER_VOCAB_COUNT + HSK_ADVANCED_VOCAB_COUNT;

export const LESSONS_PER_UNIT: Record<string, number> = {
  ...STARTER_LESSONS_PER_UNIT,
  ...hskAdvancedLessons.reduce(
    (acc, lesson) => {
      acc[lesson.unitId] = (acc[lesson.unitId] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ),
};

export { HSK1_LESSON_COUNT, STARTER_LESSON_COUNT };

export const HSK2_LESSON_COUNT = hskAdvancedLessons.filter((l) =>
  l.unitId.startsWith("unit-h2")
).length;
export const HSK3_LESSON_COUNT = hskAdvancedLessons.filter((l) =>
  l.unitId.startsWith("unit-h3")
).length;
export const HSK4_LESSON_COUNT = hskAdvancedLessons.filter((l) =>
  l.unitId.startsWith("unit-h4")
).length;
export const HSK5_LESSON_COUNT = hskAdvancedLessons.filter((l) =>
  l.unitId.startsWith("unit-h5")
).length;
export const HSK6_LESSON_COUNT = hskAdvancedLessons.filter((l) =>
  l.unitId.startsWith("unit-h6")
).length;

const HSK_BAND_SUFFIX: Record<CourseSectionId, string> = {
  starter: "Starter",
  hsk1: "HSK 1",
  hsk2: "HSK 2",
  hsk3: "HSK 3",
  hsk4: "HSK 4",
  hsk5: "HSK 5",
  hsk6: "HSK 6",
};

export const HSK_BAND_LABELS: Record<string, string> = {
  ...STARTER_BAND_LABELS,
  ...Object.fromEntries(
    hskAdvancedUnits.map((u) => [u.id, HSK_BAND_SUFFIX[sectionForHskUnit(u.id)]])
  ),
};

export const UNIT_SECTION: Record<string, CourseSectionId> = {
  ...STARTER_UNIT_SECTION,
  ...Object.fromEntries(hskAdvancedUnits.map((u) => [u.id, sectionForHskUnit(u.id)])),
};

export function getSectionForUnit(unitId: string): CourseSectionId {
  return UNIT_SECTION[unitId] ?? starterGetSectionForUnit(unitId);
}

export function getUnitsForSection(sectionId: CourseSectionId) {
  if (sectionId === "starter" || sectionId === "hsk1") {
    return starterGetUnitsForSection(sectionId);
  }
  return hskAdvancedUnits.filter((u) => sectionForHskUnit(u.id) === sectionId);
}
