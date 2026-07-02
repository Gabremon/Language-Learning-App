import type { Course } from "@/types/course";
import { COURSE_ID } from "./constants";
import { units, lessons, sentences } from "./lessons";
import { vocabItems, VOCAB_COUNT } from "./vocab";
import { lessonVocabMap, lessonSentenceMap } from "./lesson-maps";
import {
  LESSON_COUNT,
  LESSONS_PER_UNIT,
  HSK1_LESSON_COUNT,
  STARTER_LESSON_COUNT,
} from "./lesson-catalog";
import {
  COURSE_SECTIONS,
  HSK_BAND_LABELS,
  UNIT_SECTION,
  getSectionForUnit,
  getUnitsForSection,
} from "./units";

export { COURSE_ID } from "./constants";
export {
  COURSE_SECTIONS,
  HSK_BAND_LABELS,
  UNIT_SECTION,
  getSectionForUnit,
  getUnitsForSection,
  units,
  lessons,
  sentences,
  vocabItems,
  lessonVocabMap,
  lessonSentenceMap,
  LESSON_COUNT,
  LESSONS_PER_UNIT,
  HSK1_LESSON_COUNT,
  STARTER_LESSON_COUNT,
  VOCAB_COUNT,
};

export const course: Course = {
  id: COURSE_ID,
  title: "Mandarin Chinese",
  languageCode: "zh-CN",
};
