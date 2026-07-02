import type { BaseExercise } from "@/types/exercises";
import type { Lesson, Unit } from "@/types/course";
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

function getVocab(ids: string[]) {
  return ids.map((id) => vocabItems.find((v) => v.id === id)!).filter(Boolean);
}

function getUnitForLesson(lessonId: string): Unit {
  const lesson = lessons.find((l) => l.id === lessonId)!;
  return units.find((u) => u.id === lesson.unitId)!;
}

function getLessonsInUnit(unitId: string): Lesson[] {
  return lessons.filter((l) => l.unitId === unitId);
}

export const exercises: BaseExercise[] = Object.entries(lessonVocabMap).flatMap(
  ([lessonId, vocabIds]) => {
    const lesson = lessons.find((l) => l.id === lessonId)!;
    const unit = getUnitForLesson(lessonId);
    const unitLessons = getLessonsInUnit(unit.id);
    const ctx = getLessonContext(
      lessonId,
      unit,
      lesson.orderIndex,
      unitLessons.length
    );
    const vocab = getVocab(vocabIds);
    const lessonSentences = (lessonSentenceMap[lessonId] ?? [])
      .map((sid) => sentences.find((s) => s.id === sid)!)
      .filter(Boolean);

    return buildLessonExercises({
      lessonId,
      vocab,
      sentences: lessonSentences,
      ctx,
      getImageUrl: (id) => getVocabImageUrl(id),
    }).map((ex) => {
      const payload = ex.payload as unknown as Record<string, string | undefined>;
      const hanzi = payload.displayHanzi ?? payload.hanzi;
      const matched = vocab.find((v) => v.hanzi === hanzi);
      if (matched?.emoji && !payload.emoji) {
        return { ...ex, payload: { ...ex.payload, emoji: matched.emoji } };
      }
      return ex;
    });
  }
);

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
  return exercises.filter((e) => e.lessonId === lessonId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getVocabForLesson(lessonId: string) {
  const ids = lessonVocabMap[lessonId] ?? [];
  return ids.map((id) => vocabItems.find((v) => v.id === id)!).filter(Boolean);
}

export function getAllVocab() {
  return vocabItems;
}

export function getNextLesson(currentLessonId: string): Lesson | null {
  const idx = lessons.findIndex((l) => l.id === currentLessonId);
  if (idx < 0 || idx >= lessons.length - 1) return null;
  return lessons[idx + 1];
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
