import { seededShuffle } from "@/lib/lesson-generator";
import {
  getPracticeVocabPool,
  type PracticeVocabContext,
} from "@/lib/practice-vocab";
import type { UserProgress } from "@/lib/progress";
import type { VocabItem } from "@/types/course";
import type { EnglishToHanziWordBankPayload } from "@/types/exercises";

/** Words from lessons the learner has reached on the trail. */
export const WORD_SPRINT_PATH = "/word-sprint";

export function getWordSprintVocab(
  progress: UserProgress,
  context: PracticeVocabContext
): VocabItem[] {
  return getPracticeVocabPool(progress, context);
}

export function buildWordSprintPayload(
  vocab: VocabItem,
  practicePool: VocabItem[]
): EnglishToHanziWordBankPayload {
  const chars = [...vocab.hanzi];
  const decoyChars = practicePool
    .filter((x) => x.id !== vocab.id)
    .flatMap((x) => x.hanzi.split(""));
  const decoys = seededShuffle(decoyChars, `sprint-${vocab.id}-d`).slice(
    0,
    Math.max(4, 10 - chars.length)
  );
  const wordBank = seededShuffle([...chars, ...decoys], `sprint-${vocab.id}-wb`);

  return {
    english: vocab.english,
    wordBank,
    correctAnswer: chars,
    emoji: vocab.emoji,
    imageUrl: vocab.imageUrl,
  };
}

export function shuffleWordSprintQueue(items: VocabItem[]): VocabItem[] {
  return seededShuffle(items, `sprint-queue-${Date.now()}`);
}
