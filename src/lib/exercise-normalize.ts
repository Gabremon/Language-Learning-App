import type { BaseExercise } from "@/types/exercises";
import {
  isHanziToEnglish,
  isListening,
  isMultipleChoice,
  isMatchPairs,
  type ListeningPayload,
  type MatchPairsPayload,
  type MultipleChoicePayload,
} from "@/types/exercises";
import {
  englishWithoutToneLabel,
  extractToneFromEnglish,
  isToneDrillEnglish,
} from "@/lib/tone-vocab";

function stripToneFromOptions(options: string[]): string[] {
  return options.map(englishWithoutToneLabel);
}

function normalizeMultipleChoice(exercise: BaseExercise): BaseExercise {
  if (!isMultipleChoice(exercise)) return exercise;
  const { correctAnswer } = exercise.payload;
  if (!isToneDrillEnglish(correctAnswer)) return exercise;

  const payload: MultipleChoicePayload = {
    ...exercise.payload,
    options: stripToneFromOptions(exercise.payload.options),
    correctAnswer: englishWithoutToneLabel(correctAnswer),
  };
  return { ...exercise, payload };
}

function normalizeListening(exercise: BaseExercise): BaseExercise {
  if (!isListening(exercise)) return exercise;
  const { correctAnswer } = exercise.payload;
  if (!isToneDrillEnglish(correctAnswer)) return exercise;

  const payload: ListeningPayload = {
    ...exercise.payload,
    options: stripToneFromOptions(exercise.payload.options),
    correctAnswer: englishWithoutToneLabel(correctAnswer),
  };
  return { ...exercise, payload };
}

function normalizeMatchPairs(exercise: BaseExercise): BaseExercise {
  if (!isMatchPairs(exercise)) return exercise;
  const hasToneLabels = exercise.payload.pairs.some((pair) =>
    isToneDrillEnglish(pair.right)
  );
  if (!hasToneLabels) return exercise;

  const payload: MatchPairsPayload = {
    pairs: exercise.payload.pairs.map((pair) => ({
      ...pair,
      right: englishWithoutToneLabel(pair.right),
    })),
  };
  return { ...exercise, payload };
}

function normalizeHanziToEnglish(exercise: BaseExercise): BaseExercise {
  if (!isHanziToEnglish(exercise)) return exercise;
  const reference = exercise.payload.acceptedAnswers[0] ?? "";
  const correctTone = extractToneFromEnglish(reference);
  if (!correctTone) return exercise;

  const acceptedEnglishAnswers = [
    ...new Set(
      exercise.payload.acceptedAnswers.map(englishWithoutToneLabel).filter(Boolean)
    ),
  ];

  return {
    ...exercise,
    type: "tone_and_english",
    prompt: "Select the tone and type the English meaning",
    payload: {
      hanzi: exercise.payload.hanzi,
      toneOptions: ["1", "2", "3", "4"],
      correctTone,
      acceptedEnglishAnswers,
      imageUrl: exercise.payload.imageUrl,
      emoji: exercise.payload.emoji,
    },
  };
}

/** Upgrade legacy tone-drill exercises loaded from the database. */
export function normalizeExercise(exercise: BaseExercise): BaseExercise {
  const upgraded = normalizeHanziToEnglish(exercise);
  if (upgraded.type === "tone_and_english") return upgraded;

  return normalizeMatchPairs(
    normalizeListening(normalizeMultipleChoice(exercise))
  );
}

export function normalizeExercises(exercises: BaseExercise[]): BaseExercise[] {
  return exercises.map(normalizeExercise);
}
