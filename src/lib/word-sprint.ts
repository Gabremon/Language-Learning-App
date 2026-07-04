import { seededShuffle } from "@/lib/lesson-generator";
import type { UserProgress } from "@/lib/progress";
import type { VocabItem } from "@/types/course";
import type { EnglishToHanziWordBankPayload } from "@/types/exercises";

/** Words the learner has actually seen in a lesson or review. */
export const WORD_SPRINT_PATH = "/word-sprint";

export function getEncounteredVocab(
  progress: UserProgress,
  vocabItems: VocabItem[]
): VocabItem[] {
  return vocabItems.filter((v) => {
    const memory = progress.vocabMemory[v.id];
    return memory != null && memory.timesSeen > 0;
  });
}

export function buildWordSprintPayload(
  vocab: VocabItem,
  encountered: VocabItem[]
): EnglishToHanziWordBankPayload {
  const chars = [...vocab.hanzi];
  const decoyChars = encountered
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
