import { buildVocabPreviewTitle } from "@/lib/lesson-titles";
import { HSK1_UNIT_ORDER, HSK1_VOCAB_BY_UNIT, type Hsk1WordDef } from "./hsk1-vocab-data";
import type { LessonDef } from "./lesson-catalog";
import { STARTER_LESSONS } from "./starter-lessons";
import { UNIT_DEFS } from "./units";

const WORDS_PER_LESSON = 4;

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

function unitSlug(unitId: string): string {
  return unitId.replace("unit-", "");
}

function lessonTitle(words: Hsk1WordDef[], unitTitle: string, index: number, isFinal: boolean, isLast: boolean): string {
  if (isFinal && isLast) return "HSK 1 Graduation Exam";
  if (isFinal) return `HSK 1 Review ${index + 1}`;
  return buildVocabPreviewTitle(words, `${unitTitle} ${index + 1}`);
}

function buildHsk1Lessons(): LessonDef[] {
  const lessons: LessonDef[] = [];
  const unitTitleById = Object.fromEntries(UNIT_DEFS.map((u) => [u.id, u.title]));

  for (const unitId of HSK1_UNIT_ORDER) {
    const words = HSK1_VOCAB_BY_UNIT[unitId];
    const isFinal = unitId === "unit-h1-final";
    const chunks = chunk(words, WORDS_PER_LESSON);
    const unitTitle = unitTitleById[unitId] ?? unitId;

    chunks.forEach((wordChunk, chunkIndex) => {
      const isLast = chunkIndex === chunks.length - 1;
      lessons.push({
        id: `lesson-${unitSlug(unitId)}-${chunkIndex + 1}`,
        unitId,
        title: lessonTitle(wordChunk, unitTitle, chunkIndex, isFinal, isLast),
        orderIndex: chunkIndex + 1,
        vocab: wordChunk.map((w) => w.id),
      });
    });

    if (!isFinal) {
      const reviewVocab = words.slice(0, Math.min(8, words.length)).map((w) => w.id);
      lessons.push({
        id: `lesson-${unitSlug(unitId)}-review`,
        unitId,
        title: `${unitTitle} Review`,
        orderIndex: chunks.length + 1,
        vocab: reviewVocab,
      });
    }
  }

  return lessons;
}

export function buildLessonCatalog(): LessonDef[] {
  return [...STARTER_LESSONS, ...buildHsk1Lessons()];
}

export const LESSON_CATALOG = buildLessonCatalog();
export const LESSON_COUNT = LESSON_CATALOG.length;

export const LESSONS_PER_UNIT: Record<string, number> = LESSON_CATALOG.reduce(
  (acc, lesson) => {
    acc[lesson.unitId] = (acc[lesson.unitId] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

export const HSK1_LESSON_COUNT = LESSON_CATALOG.filter((l) => l.unitId.startsWith("unit-h1")).length;
export const STARTER_LESSON_COUNT = STARTER_LESSONS.length;
