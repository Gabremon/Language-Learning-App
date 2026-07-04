"use client";

import { EnglishToHanziWordBankExercise } from "@/components/exercises/EnglishToHanziWordBankExercise";
import { FillInBlankExercise } from "@/components/exercises/FillInBlankExercise";
import { HanziToEnglishExercise } from "@/components/exercises/HanziToEnglishExercise";
import { ListeningExercise } from "@/components/exercises/ListeningExercise";
import { MatchPairsExercise } from "@/components/exercises/MatchPairsExercise";
import { MultipleChoiceExercise } from "@/components/exercises/MultipleChoiceExercise";
import { PinyinRecognitionExercise } from "@/components/exercises/PinyinRecognitionExercise";
import { ReversePinyinExercise } from "@/components/exercises/ReversePinyinExercise";
import { ToneAndEnglishExercise } from "@/components/exercises/ToneAndEnglishExercise";
import type { BaseExercise, ToneAndEnglishAnswer, UserAnswer } from "@/types/exercises";
import {
  isEnglishToHanziWordBank,
  isFillInBlank,
  isHanziToEnglish,
  isListening,
  isMatchPairs,
  isMultipleChoice,
  isPinyinRecognition,
  isReversePinyin,
  isToneAndEnglish,
} from "@/types/exercises";

interface Props {
  exercise: BaseExercise;
  answer: UserAnswer | null;
  onAnswerChange: (answer: UserAnswer) => void;
  disabled?: boolean;
}

export function ExerciseRenderer({ exercise, answer, onAnswerChange, disabled }: Props) {
  if (isListening(exercise)) {
    return (
      <ListeningExercise
        payload={exercise.payload}
        selected={typeof answer === "string" ? answer : null}
        onSelect={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  if (isMultipleChoice(exercise)) {
    return (
      <MultipleChoiceExercise
        payload={exercise.payload}
        selected={typeof answer === "string" ? answer : null}
        onSelect={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  if (isHanziToEnglish(exercise)) {
    return (
      <HanziToEnglishExercise
        payload={exercise.payload}
        value={typeof answer === "string" ? answer : ""}
        onChange={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  if (isEnglishToHanziWordBank(exercise)) {
    return (
      <EnglishToHanziWordBankExercise
        payload={exercise.payload}
        selected={Array.isArray(answer) ? answer : []}
        onSelect={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  if (isMatchPairs(exercise)) {
    const matches: Record<string, string> =
      answer !== null &&
      typeof answer === "object" &&
      !Array.isArray(answer) &&
      !("tone" in answer) &&
      !("english" in answer)
        ? (answer as Record<string, string>)
        : {};
    return (
      <MatchPairsExercise
        payload={exercise.payload}
        matches={matches}
        onMatch={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  if (isFillInBlank(exercise)) {
    return (
      <FillInBlankExercise
        payload={exercise.payload}
        selected={typeof answer === "string" ? answer : null}
        onSelect={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  if (isPinyinRecognition(exercise)) {
    return (
      <PinyinRecognitionExercise
        payload={exercise.payload}
        selected={typeof answer === "string" ? answer : null}
        onSelect={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  if (isReversePinyin(exercise)) {
    return (
      <ReversePinyinExercise
        payload={exercise.payload}
        selected={typeof answer === "string" ? answer : null}
        onSelect={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  if (isToneAndEnglish(exercise)) {
    const toneAnswer =
      typeof answer === "object" &&
      answer !== null &&
      !Array.isArray(answer) &&
      "tone" in answer &&
      "english" in answer
        ? { tone: String(answer.tone), english: String(answer.english) }
        : null;
    return (
      <ToneAndEnglishExercise
        payload={exercise.payload}
        value={toneAnswer}
        onChange={onAnswerChange}
        disabled={disabled}
      />
    );
  }

  return <p className="text-gray-500">Unknown exercise type</p>;
}
