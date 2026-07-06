import type { VocabItem } from "@/types/course";
import type { BaseExercise } from "@/types/exercises";
import {
  isEnglishToHanziWordBank,
  isFillInBlank,
  isHanziToEnglish,
  isListening,
  isMatchPairs,
  isMultipleChoice,
  isPinyinRecognition,
  isReversePinyin,
  isDialogueResponse,
  isYesNoQuestion,
} from "@/types/exercises";

/** Collect hanzi / english tokens from an exercise payload for vocab matching. */
export function extractExerciseTerms(exercise: BaseExercise): string[] {
  const terms: string[] = [];

  if (isMultipleChoice(exercise)) {
    if (exercise.payload.displayHanzi) terms.push(exercise.payload.displayHanzi);
    if (exercise.payload.question) terms.push(exercise.payload.question);
  }
  if (isHanziToEnglish(exercise)) {
    terms.push(exercise.payload.hanzi);
  }
  if (isListening(exercise)) {
    terms.push(exercise.payload.hanzi);
  }
  if (isPinyinRecognition(exercise)) {
    terms.push(exercise.payload.hanzi);
  }
  if (isEnglishToHanziWordBank(exercise)) {
    terms.push(exercise.payload.english);
    terms.push(...exercise.payload.correctAnswer);
  }
  if (isMatchPairs(exercise)) {
    for (const pair of exercise.payload.pairs) {
      terms.push(pair.left, pair.right);
    }
  }
  if (isFillInBlank(exercise)) {
    terms.push(exercise.payload.correctAnswer, exercise.payload.fullSentence, exercise.payload.sentence);
  }
  if (isReversePinyin(exercise)) {
    terms.push(exercise.payload.correctAnswer, exercise.payload.pinyin);
  }
  if (isDialogueResponse(exercise)) {
    for (const line of exercise.payload.lines) {
      terms.push(line.hanzi);
    }
    terms.push(exercise.payload.correctAnswer);
  }
  if (isYesNoQuestion(exercise)) {
    terms.push(exercise.payload.statement, exercise.payload.claim);
  }

  if (exercise.explanation) terms.push(exercise.explanation);
  return terms;
}

export function getRelatedVocab(exercise: BaseExercise, lessonVocab: VocabItem[]): VocabItem[] {
  const terms = extractExerciseTerms(exercise);
  const blob = terms.join(" ").toLowerCase();

  const matched = lessonVocab.filter((v) => {
    if (blob.includes(v.hanzi)) return true;
    if (blob.includes(v.pinyin.toLowerCase())) return true;
    const english = v.english.toLowerCase();
    return english.split(/[/,]/).some((part) => {
      const trimmed = part.trim();
      return trimmed.length > 1 && blob.includes(trimmed);
    });
  });

  if (matched.length > 0) return matched;

  return lessonVocab.slice(0, Math.min(3, lessonVocab.length));
}

export interface MissedExerciseRecord {
  exerciseId: string;
  exercise: BaseExercise;
  correctAnswer: string;
  explanation?: string;
  missCount: number;
}

export function recordMiss(
  log: MissedExerciseRecord[],
  exercise: BaseExercise,
  correctAnswer: string,
  explanation?: string
): MissedExerciseRecord[] {
  const existing = log.find((m) => m.exerciseId === exercise.id);
  if (existing) {
    return log.map((m) =>
      m.exerciseId === exercise.id ? { ...m, missCount: m.missCount + 1 } : m
    );
  }
  return [
    ...log,
    { exerciseId: exercise.id, exercise, correctAnswer, explanation, missCount: 1 },
  ];
}
