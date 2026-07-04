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

const VOWEL_CHARS = /[aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

const INITIALS = [
  "zh",
  "ch",
  "sh",
  "b",
  "p",
  "m",
  "f",
  "d",
  "t",
  "n",
  "l",
  "g",
  "k",
  "h",
  "j",
  "q",
  "x",
  "r",
  "z",
  "c",
  "s",
  "y",
  "w",
] as const;

/** Compose decomposed tone marks (NFD) into single graphemes (NFC). */
export function normalizePinyin(pinyin: string): string {
  return pinyin.normalize("NFC").trim();
}

function hasVowel(syllable: string): boolean {
  return VOWEL_CHARS.test(syllable);
}

function couldStartSyllable(text: string, index: number): boolean {
  const rest = text.slice(index).toLowerCase();
  for (const initial of INITIALS) {
    if (rest.startsWith(initial)) {
      const after = rest.slice(initial.length);
      if (!after || hasVowel(after[0] ?? "")) return true;
    }
  }
  return hasVowel(rest[0] ?? "");
}

/** Split concatenated pinyin (e.g. Zhōngguó) into syllable tokens. */
function segmentUnspacedPinyin(pinyin: string): string[] {
  const syllables: string[] = [];
  let i = 0;

  while (i < pinyin.length) {
    let initial = "";
    const lower = pinyin.slice(i).toLowerCase();
    for (const ini of INITIALS) {
      if (lower.startsWith(ini)) {
        initial = pinyin.slice(i, i + ini.length);
        i += ini.length;
        break;
      }
    }

    let final = "";
    while (i < pinyin.length) {
      final += pinyin[i];
      i++;
      if (hasVowel(final) && i < pinyin.length && couldStartSyllable(pinyin, i)) {
        break;
      }
    }

    const syllable = (initial + final).trim();
    if (syllable) syllables.push(syllable);
  }

  return syllables.length > 0 ? syllables : [pinyin];
}

/** Split display pinyin into syllable tokens (handles spaces and concatenated forms). */
export function splitPinyinTokens(pinyin: string): string[] {
  const normalized = normalizePinyin(pinyin);
  if (!normalized) return [];

  if (/\s/.test(normalized)) {
    return normalized.split(/\s+/).filter(Boolean);
  }

  return segmentUnspacedPinyin(normalized);
}

/** Tone number 1–4 from tone marks; 0 for neutral / unstressed syllables. */
export function getSyllableTone(syllable: string): string {
  for (const char of syllable) {
    const tone = TONE_MARKS[char];
    if (tone) return tone;
  }
  return "0";
}
