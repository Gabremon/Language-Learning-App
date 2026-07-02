import { LESSON_CATALOG } from "./lesson-catalog";

export const lessonVocabMap: Record<string, string[]> = Object.fromEntries(
  LESSON_CATALOG.map((lesson) => [lesson.id, lesson.vocab])
);

export const lessonSentenceMap: Record<string, string[]> = Object.fromEntries(
  LESSON_CATALOG.map((lesson) => [lesson.id, lesson.sentences ?? []])
);
