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
  isToneAndEnglish,
} from "@/types/exercises";

export function normalizeEnglishAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"()]/g, "")
    .replace(/\s+/g, "");
}

/** Normalized forms that count as correct for a reference English answer. */
export function expandEnglishAnswerVariants(answer: string): Set<string> {
  const variants = new Set<string>();
  const normParts = answer
    .split("/")
    .map((part) => normalizeEnglishAnswer(part))
    .filter(Boolean);

  for (const part of normParts) {
    variants.add(part);
  }

  const fullNorm = normalizeEnglishAnswer(answer);
  if (fullNorm) variants.add(fullNorm);

  if (normParts.length > 1) {
    variants.add([...normParts].sort().join("/"));
  }

  return variants;
}

export function matchesEnglishAnswer(
  userAnswer: string,
  acceptedAnswers: string[]
): boolean {
  const userForms = expandEnglishAnswerVariants(userAnswer);
  if (userForms.size === 0) return false;

  for (const accepted of acceptedAnswers) {
    const acceptedForms = expandEnglishAnswerVariants(accepted);
    for (const form of userForms) {
      if (acceptedForms.has(form)) return true;
    }
  }
  return false;
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
    const isCorrect = matchesEnglishAnswer(
      String(userAnswer),
      exercise.payload.acceptedAnswers
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

  if (isToneAndEnglish(exercise)) {
    const answer =
      typeof userAnswer === "object" && userAnswer !== null && !Array.isArray(userAnswer)
        ? (userAnswer as { tone?: string; english?: string })
        : {};
    const toneOk = answer.tone === exercise.payload.correctTone;
    const englishOk = matchesEnglishAnswer(
      answer.english ?? "",
      exercise.payload.acceptedEnglishAnswers
    );
    const gloss = exercise.payload.acceptedEnglishAnswers[0] ?? "";
    return {
      isCorrect: toneOk && englishOk,
      correctAnswer: `${gloss} (tone ${exercise.payload.correctTone})`,
      explanation: exercise.explanation,
    };
  }

  return { isCorrect: false, correctAnswer: "" };
}

export function formatUserAnswer(userAnswer: UserAnswer): string {
  if (Array.isArray(userAnswer)) return userAnswer.join("");
  if (typeof userAnswer === "object" && userAnswer !== null) {
    if ("tone" in userAnswer && "english" in userAnswer) {
      const answer = userAnswer as { tone: string; english: string };
      return `Tone ${answer.tone} · ${answer.english}`;
    }
    return Object.entries(userAnswer)
      .map(([, v]) => v)
      .join(", ");
  }
  return String(userAnswer);
}
