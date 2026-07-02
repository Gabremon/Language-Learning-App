export type ExerciseType =
  | "multiple_choice"
  | "hanzi_to_english"
  | "english_to_hanzi_word_bank"
  | "match_pairs"
  | "listening"
  | "fill_in_blank"
  | "pinyin_recognition"
  | "reverse_pinyin";

export interface BaseExercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  prompt: string;
  payload: ExercisePayload;
  orderIndex: number;
  explanation?: string;
}

export interface MultipleChoicePayload {
  question: string;
  options: string[];
  correctAnswer: string;
  displayHanzi?: string;
  pinyin?: string;
  imageUrl?: string;
  emoji?: string;
}

export interface HanziToEnglishPayload {
  hanzi: string;
  pinyin?: string;
  acceptedAnswers: string[];
  imageUrl?: string;
  emoji?: string;
}

export interface EnglishToHanziWordBankPayload {
  english: string;
  wordBank: string[];
  correctAnswer: string[];
  imageUrl?: string;
  emoji?: string;
}

export interface MatchPairItem {
  id: string;
  left: string;
  right: string;
  imageUrl?: string;
  emoji?: string;
}

export interface MatchPairsPayload {
  pairs: MatchPairItem[];
}

export interface ListeningPayload {
  hanzi: string;
  options: string[];
  correctAnswer: string;
  pinyin?: string;
  imageUrl?: string;
  emoji?: string;
}

export interface FillInBlankPayload {
  sentence: string;
  blankIndex: number;
  options?: string[];
  correctAnswer: string;
  fullSentence: string;
  fullPinyin?: string;
}

export interface PinyinRecognitionPayload {
  hanzi: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
  emoji?: string;
}

export interface ReversePinyinPayload {
  pinyin: string;
  options: string[];
  correctAnswer: string;
}

export type ExercisePayload =
  | MultipleChoicePayload
  | HanziToEnglishPayload
  | EnglishToHanziWordBankPayload
  | MatchPairsPayload
  | ListeningPayload
  | FillInBlankPayload
  | PinyinRecognitionPayload
  | ReversePinyinPayload;

export type UserAnswer =
  | string
  | string[]
  | Record<string, string>;

export interface ExerciseResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
}

export function isMultipleChoice(
  exercise: BaseExercise
): exercise is BaseExercise & { payload: MultipleChoicePayload } {
  return exercise.type === "multiple_choice";
}

export function isHanziToEnglish(
  exercise: BaseExercise
): exercise is BaseExercise & { payload: HanziToEnglishPayload } {
  return exercise.type === "hanzi_to_english";
}

export function isEnglishToHanziWordBank(
  exercise: BaseExercise
): exercise is BaseExercise & { payload: EnglishToHanziWordBankPayload } {
  return exercise.type === "english_to_hanzi_word_bank";
}

export function isMatchPairs(
  exercise: BaseExercise
): exercise is BaseExercise & { payload: MatchPairsPayload } {
  return exercise.type === "match_pairs";
}

export function isListening(
  exercise: BaseExercise
): exercise is BaseExercise & { payload: ListeningPayload } {
  return exercise.type === "listening";
}

export function isFillInBlank(
  exercise: BaseExercise
): exercise is BaseExercise & { payload: FillInBlankPayload } {
  return exercise.type === "fill_in_blank";
}

export function isPinyinRecognition(
  exercise: BaseExercise
): exercise is BaseExercise & { payload: PinyinRecognitionPayload } {
  return exercise.type === "pinyin_recognition";
}

export function isReversePinyin(
  exercise: BaseExercise
): exercise is BaseExercise & { payload: ReversePinyinPayload } {
  return exercise.type === "reverse_pinyin";
}
