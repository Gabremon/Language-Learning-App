import type { BaseExercise } from "@/types/exercises";
import type { Lesson, Unit, VocabItem } from "@/types/course";
import {
  course,
  units,
  lessons,
  vocabItems,
  sentences,
  lessonVocabMap,
  lessonSentenceMap,
} from "./course-content";
import {
  buildLessonExercises,
  getLessonContext,
} from "@/lib/lesson-generator";
import { getVocabImageUrl } from "@/lib/vocab-images";

export {
  course,
  units,
  lessons,
  vocabItems,
  sentences,
  lessonVocabMap,
  lessonSentenceMap,
  COURSE_ID,
} from "./course-content";

const exercisesByLessonId = new Map<string, BaseExercise[]>();
let vocabById: Map<string, VocabItem> | null = null;
let sentencesById: Map<string, (typeof sentences)[number]> | null = null;
const lessonsPerUnit = new Map<string, number>();

function getVocabById(): Map<string, VocabItem> {
  if (!vocabById) {
    vocabById = new Map(vocabItems.map((item) => [item.id, item]));
  }
  return vocabById;
}

function getSentencesById(): Map<string, (typeof sentences)[number]> {
  if (!sentencesById) {
    sentencesById = new Map(sentences.map((item) => [item.id, item]));
  }
  return sentencesById;
}

function getUnitLessonCount(unitId: string): number {
  let count = lessonsPerUnit.get(unitId);
  if (count === undefined) {
    count = lessons.filter((lesson) => lesson.unitId === unitId).length;
    lessonsPerUnit.set(unitId, count);
  }
  return count;
}

function getVocab(ids: string[]): VocabItem[] {
  const byId = getVocabById();
  return ids.map((id) => byId.get(id)).filter((item): item is VocabItem => item != null);
}

function buildExercisesForLesson(lessonId: string): BaseExercise[] {
  const cached = exercisesByLessonId.get(lessonId);
  if (cached) return cached;

  const vocabIds = lessonVocabMap[lessonId];
  if (!vocabIds?.length) {
    exercisesByLessonId.set(lessonId, []);
    return [];
  }

  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    exercisesByLessonId.set(lessonId, []);
    return [];
  }

  const unit = units.find((item) => item.id === lesson.unitId);
  if (!unit) {
    exercisesByLessonId.set(lessonId, []);
    return [];
  }

  const ctx = getLessonContext(
    lessonId,
    unit,
    lesson.orderIndex,
    getUnitLessonCount(unit.id)
  );
  const vocab = getVocab(vocabIds);
  const sentenceLookup = getSentencesById();
  const lessonSentences = (lessonSentenceMap[lessonId] ?? [])
    .map((sid) => sentenceLookup.get(sid))
    .filter((item): item is (typeof sentences)[number] => item != null);

  const built = buildLessonExercises({
    lessonId,
    vocab,
    sentences: lessonSentences,
    ctx,
    getImageUrl: (id) => getVocabImageUrl(id),
  }).map((ex) => {
    const payload = ex.payload as unknown as Record<string, string | undefined>;
    const hanzi = payload.displayHanzi ?? payload.hanzi;
    const matched = vocab.find((item) => item.hanzi === hanzi);
    if (matched?.emoji && !payload.emoji) {
      return { ...ex, payload: { ...ex.payload, emoji: matched.emoji } };
    }
    return ex;
  });

  exercisesByLessonId.set(lessonId, built);
  return built;
}

/** Build every lesson's exercises — for SQL generators only. */
export function getAllExercises(): BaseExercise[] {
  return Object.keys(lessonVocabMap).flatMap((lessonId) => buildExercisesForLesson(lessonId));
}

export function getLessonById(lessonId: string) {
  return lessons.find((l) => l.id === lessonId);
}

export function getUnitById(unitId: string) {
  return units.find((u) => u.id === unitId);
}

export function getLessonsForUnit(unitId: string) {
  return lessons.filter((l) => l.unitId === unitId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getExercisesForLesson(lessonId: string) {
  return buildExercisesForLesson(lessonId);
}

export function getVocabForLesson(lessonId: string) {
  const ids = lessonVocabMap[lessonId] ?? [];
  return getVocab(ids);
}

export function getAllVocab() {
  return vocabItems;
}

export function getNextLesson(currentLessonId: string): Lesson | null {
  const ordered = [...lessons].sort((a, b) => {
    const unitA = units.find((u) => u.id === a.unitId)?.orderIndex ?? 0;
    const unitB = units.find((u) => u.id === b.unitId)?.orderIndex ?? 0;
    return unitA - unitB || a.orderIndex - b.orderIndex;
  });
  const idx = ordered.findIndex((l) => l.id === currentLessonId);
  if (idx < 0 || idx >= ordered.length - 1) return null;
  return ordered[idx + 1];
}

export function isLessonUnlocked(lessonId: string, completedIds: string[]): boolean {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  const unitLessons = getLessonsForUnit(lesson.unitId);
  const lessonIdx = unitLessons.findIndex((l) => l.id === lessonId);
  if (lessonIdx === 0) {
    const unitIdx = units.findIndex((u) => u.id === lesson.unitId);
    if (unitIdx === 0) return true;
    const prevUnit = units[unitIdx - 1];
    const prevUnitLessons = getLessonsForUnit(prevUnit.id);
    return prevUnitLessons.every((l) => completedIds.includes(l.id));
  }
  return completedIds.includes(unitLessons[lessonIdx - 1].id);
}
