import type { BaseExercise } from "@/types/exercises";
import {
  isDialogueResponse,
  isEnglishToHanziWordBank,
  isFillInBlank,
  isHanziToEnglish,
  isListening,
  isMatchPairs,
  isMultipleChoice,
  isPinyinRecognition,
  isReversePinyin,
  isToneAndEnglish,
  isYesNoQuestion,
} from "@/types/exercises";

/** Mandarin text to read aloud after an exercise is checked. */
export function getSpeakableHanzi(exercise: BaseExercise): string | null {
  if (isListening(exercise)) return exercise.payload.hanzi;
  if (isHanziToEnglish(exercise)) return exercise.payload.hanzi;
  if (isPinyinRecognition(exercise)) return exercise.payload.hanzi;
  if (isToneAndEnglish(exercise)) return exercise.payload.hanzi;
  if (isReversePinyin(exercise)) return exercise.payload.correctAnswer;

  if (isMultipleChoice(exercise)) {
    if (exercise.payload.displaySentence) return exercise.payload.displaySentence;
    if (exercise.payload.displayHanzi) return exercise.payload.displayHanzi;
    return null;
  }

  if (isEnglishToHanziWordBank(exercise)) {
    return exercise.payload.correctAnswer.join("");
  }

  if (isFillInBlank(exercise)) return exercise.payload.fullSentence;

  if (isDialogueResponse(exercise)) return exercise.payload.correctAnswer;

  if (isYesNoQuestion(exercise)) return exercise.payload.statement;

  if (isMatchPairs(exercise)) {
    const hanzi = exercise.payload.pairs.map((pair) => pair.left);
    return hanzi.length > 0 ? hanzi.join("，") : null;
  }

  return null;
}
