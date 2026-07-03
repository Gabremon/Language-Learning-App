const TONE_MARKS: Record<string, string> = {
  ā: "1",
  á: "2",
  ǎ: "3",
  à: "4",
  ē: "1",
  é: "2",
  ě: "3",
  è: "4",
  ī: "1",
  í: "2",
  ǐ: "3",
  ì: "4",
  ō: "1",
  ó: "2",
  ǒ: "3",
  ò: "4",
  ū: "1",
  ú: "2",
  ǔ: "3",
  ù: "4",
  ǖ: "1",
  ǘ: "2",
  ǚ: "3",
  ǜ: "4",
};

export const PINYIN_TONE_COLORS: Record<string, string> = {
  "1": "text-red-500",
  "2": "text-orange-500",
  "3": "text-green-500",
  "4": "text-blue-500",
  "0": "text-stone-600",
};

/** Split display pinyin into syllable tokens (space-separated; keeps punctuation attached). */
export function splitPinyinTokens(pinyin: string): string[] {
  return pinyin.trim().split(/\s+/).filter(Boolean);
}

/** Tone number 1–4 from tone marks; 0 for neutral / unstressed syllables. */
export function getSyllableTone(syllable: string): string {
  for (const char of syllable) {
    const tone = TONE_MARKS[char];
    if (tone) return tone;
  }
  return "0";
}
