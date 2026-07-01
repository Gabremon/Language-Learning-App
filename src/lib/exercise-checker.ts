import type { BaseExercise, ExerciseResult, UserAnswer } from "@/types/exercises";
import {
  isEnglishToHanziWordBank,
  isFillInBlank,
  isHanziToEnglish,
  isListening,
  isMatchPairs,
  isMultipleChoice,
  isPinyinRecognition,
  isReversePinyin,
} from "@/types/exercises";

export function normalizeEnglishAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"()]/g, "")
    .replace(/\s+/g, " ");
}

export function checkExerciseAnswer(
  exercise: BaseExercise,
  userAnswer: UserAnswer
): ExerciseResult {
  if (isMultipleChoice(exercise)) {
    const selected = String(userAnswer);
    const isCorrect = selected === exercise.payload.correctAnswer;
    return {
      isCorrect,
      correctAnswer: exercise.payload.correctAnswer,
      explanation: exercise.explanation,
    };
  }

  if (isHanziToEnglish(exercise)) {
    const normalized = normalizeEnglishAnswer(String(userAnswer));
    const isCorrect = exercise.payload.acceptedAnswers.some(
      (a) => normalizeEnglishAnswer(a) === normalized
    );
    return {
      isCorrect,
      correctAnswer: exercise.payload.acceptedAnswers[0],
      explanation: exercise.explanation,
    };
  }

  if (isEnglishToHanziWordBank(exercise)) {
    const answer = userAnswer as string[];
    const correct = exercise.payload.correctAnswer;
    const isCorrect =
      answer.length === correct.length &&
      answer.every((v, i) => v === correct[i]);
    return {
      isCorrect,
      correctAnswer: correct.join(""),
      explanation: exercise.explanation,
    };
  }

  if (isMatchPairs(exercise)) {
    const pairs = userAnswer as Record<string, string>;
    const isCorrect = exercise.payload.pairs.every(
      (p) => pairs[p.id] === p.right
    );
    return {
      isCorrect,
      correctAnswer: exercise.payload.pairs
        .map((p) => `${p.left} → ${p.right}`)
        .join(", "),
      explanation: exercise.explanation,
    };
  }

  if (isListening(exercise)) {
    const selected = String(userAnswer);
    const isCorrect = selected === exercise.payload.correctAnswer;
    return {
      isCorrect,
      correctAnswer: exercise.payload.correctAnswer,
      explanation: exercise.explanation,
    };
  }

  if (isFillInBlank(exercise)) {
    const answer = String(userAnswer).trim();
    const isCorrect = answer === exercise.payload.correctAnswer;
    return {
      isCorrect,
      correctAnswer: exercise.payload.correctAnswer,
      explanation: exercise.explanation,
    };
  }

  if (isPinyinRecognition(exercise)) {
    const selected = String(userAnswer);
    const isCorrect = selected === exercise.payload.correctAnswer;
    return {
      isCorrect,
      correctAnswer: exercise.payload.correctAnswer,
      explanation: exercise.explanation,
    };
  }

  if (isReversePinyin(exercise)) {
    const selected = String(userAnswer);
    const isCorrect = selected === exercise.payload.correctAnswer;
    return {
      isCorrect,
      correctAnswer: exercise.payload.correctAnswer,
      explanation: exercise.explanation,
    };
  }

  return { isCorrect: false, correctAnswer: "" };
}

export function formatUserAnswer(userAnswer: UserAnswer): string {
  if (Array.isArray(userAnswer)) return userAnswer.join("");
  if (typeof userAnswer === "object") {
    return Object.entries(userAnswer)
      .map(([, v]) => v)
      .join(", ");
  }
  return String(userAnswer);
}
