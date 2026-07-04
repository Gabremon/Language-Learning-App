/** Strip trailing "(tone N)" gloss hints used in starter tone drills. */
export function englishWithoutToneLabel(english: string): string {
  return english.replace(/\s*\(tone\s*\d\)\s*$/i, "").trim();
}

export function extractToneFromEnglish(english: string): string | null {
  const match = english.match(/\(tone\s*(\d)\)/i);
  return match ? match[1] : null;
}

export function isToneDrillEnglish(english: string): boolean {
  return /\(tone\s*\d\)/i.test(english);
}

/** Starter minimal-pair tone vocabulary (妈/麻/马/骂). */
export const TONE_DRILL_VOCAB_IDS = new Set([
  "v-ma-mother",
  "v-ma-hemp",
  "v-ma-horse",
  "v-ma-scold",
]);

export function isToneDrillVocab(vocabId: string): boolean {
  return TONE_DRILL_VOCAB_IDS.has(vocabId);
}
