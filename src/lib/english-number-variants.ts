const WORD_TO_DIGIT_ENTRIES: [string, string][] = [
  ["zero", "0"],
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
  ["ten", "10"],
  ["eleven", "11"],
  ["twelve", "12"],
  ["thirteen", "13"],
  ["fourteen", "14"],
  ["fifteen", "15"],
  ["sixteen", "16"],
  ["seventeen", "17"],
  ["eighteen", "18"],
  ["nineteen", "19"],
  ["twenty", "20"],
  ["thirty", "30"],
  ["forty", "40"],
  ["fifty", "50"],
  ["sixty", "60"],
  ["seventy", "70"],
  ["eighty", "80"],
  ["ninety", "90"],
  ["hundred", "100"],
  ["thousand", "1000"],
];

const WORD_TO_DIGIT_SORTED = [...WORD_TO_DIGIT_ENTRIES].sort(
  (a, b) => b[0].length - a[0].length
);

function numberToWord(n: number): string {
  if (!Number.isFinite(n) || n < 0) return String(n);
  if (n < 10) return WORD_TO_DIGIT_ENTRIES[n][0];
  if (n < 20) return WORD_TO_DIGIT_ENTRIES[n - 10 + 9][0];
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    const tensWord = WORD_TO_DIGIT_ENTRIES.find(([, d]) => d === String(tens))?.[0];
    if (!tensWord) return String(n);
    if (ones === 0) return tensWord;
    const onesWord = WORD_TO_DIGIT_ENTRIES[ones][0];
    return `${tensWord}${onesWord}`;
  }
  return String(n);
}

function replaceDigitsWithWords(value: string): string {
  return value.replace(/\d+/g, (match) => numberToWord(Number.parseInt(match, 10)));
}

function replaceWordsWithDigits(value: string): string {
  let next = value;
  for (const [word, digit] of WORD_TO_DIGIT_SORTED) {
    next = next.split(word).join(digit);
  }
  return next;
}

/** Add digit/word variants for normalized English answers (spaces already removed). */
export function expandNumberVariants(normalized: string): string[] {
  if (!normalized) return [];

  const variants = new Set<string>([normalized]);
  const withDigits = replaceWordsWithDigits(normalized);
  const withWords = replaceDigitsWithWords(normalized);

  variants.add(withDigits);
  variants.add(withWords);
  variants.add(replaceWordsWithDigits(withWords));
  variants.add(replaceDigitsWithWords(withDigits));

  return [...variants].filter(Boolean);
}
