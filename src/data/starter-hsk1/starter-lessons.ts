import type { LessonDef } from "./lesson-catalog";

/** Starter band: pinyin, tones, IME — 20 micro-lessons (not counted toward HSK 1 word inventory). */
export const STARTER_LESSONS: LessonDef[] = [
  { id: "lesson-sa-1", unitId: "unit-sa", title: "Meet Pinyin", orderIndex: 1, vocab: ["v-ni", "v-wo", "v-hao"] },
  { id: "lesson-sa-2", unitId: "unit-sa", title: "Core Syllables", orderIndex: 2, vocab: ["v-shi", "v-ma", "v-bu", "v-ren"] },
  { id: "lesson-sa-3", unitId: "unit-sa", title: "Tone One and Tone Four", orderIndex: 3, vocab: ["v-ma-mother", "v-ma-hemp", "v-ma-horse", "v-ma-scold"] },
  { id: "lesson-sa-4", unitId: "unit-sa", title: "Tone Two and Tone Three", orderIndex: 4, vocab: ["v-ni", "v-wo", "v-hao", "v-laoshi", "v-shui"] },
  { id: "lesson-sa-5", unitId: "unit-sa", title: "Hello!", orderIndex: 5, vocab: ["v-nihao", "v-hao", "v-ni"], sentences: ["s-1"] },
  { id: "lesson-sa-6", unitId: "unit-sa", title: "Goodbye", orderIndex: 6, vocab: ["v-zaijian", "v-nihao", "v-hao"], sentences: ["s-2"] },
  { id: "lesson-sa-7", unitId: "unit-sa", title: "Thank You", orderIndex: 7, vocab: ["v-xiexie", "v-bukeqi", "v-qing"], sentences: ["s-24"] },
  { id: "lesson-sa-8", unitId: "unit-sa", title: "What's Your Name?", orderIndex: 8, vocab: ["v-jiao", "v-shenme", "v-mingzi", "v-wo"], sentences: ["s-3"] },
  { id: "lesson-sa-9", unitId: "unit-sa", title: "Yes or No?", orderIndex: 9, vocab: ["v-ma", "v-shi", "v-bu", "v-xuesheng"], sentences: ["s-4"] },
  { id: "lesson-sa-10", unitId: "unit-sa", title: "Greeting Review", orderIndex: 10, vocab: ["v-nihao", "v-zaijian", "v-xiexie", "v-jiao", "v-ma"], sentences: ["s-1", "s-3"] },
  { id: "lesson-sb-1", unitId: "unit-sb", title: "I Am…", orderIndex: 1, vocab: ["v-wo", "v-shi", "v-ren"], sentences: ["s-4"] },
  { id: "lesson-sb-2", unitId: "unit-sb", title: "I Am from ___", orderIndex: 2, vocab: ["v-laizi", "v-zhongguo", "v-meiguo"], sentences: ["s-6"] },
  { id: "lesson-sb-3", unitId: "unit-sb", title: "Are You a Student?", orderIndex: 3, vocab: ["v-ni", "v-xuesheng", "v-laoshi", "v-ma"], sentences: ["s-5"] },
  { id: "lesson-sb-4", unitId: "unit-sb", title: "Numbers 1–3", orderIndex: 4, vocab: ["v-yi", "v-er", "v-san"] },
  { id: "lesson-sb-5", unitId: "unit-sb", title: "Numbers 4–6", orderIndex: 5, vocab: ["v-si", "v-wu", "v-liu"] },
  { id: "lesson-sb-6", unitId: "unit-sb", title: "Numbers 7–10", orderIndex: 6, vocab: ["v-qi", "v-ba", "v-jiu", "v-shi-num"] },
  { id: "lesson-sb-7", unitId: "unit-sb", title: "Measure Word 个", orderIndex: 7, vocab: ["v-ge", "v-yi", "v-ren", "v-xuesheng"] },
  { id: "lesson-sb-8", unitId: "unit-sb", title: "How Old Are You?", orderIndex: 8, vocab: ["v-sui", "v-ji", "v-duoda", "v-ma"], sentences: ["s-8"] },
  { id: "lesson-sb-9", unitId: "unit-sb", title: "This and That", orderIndex: 9, vocab: ["v-zhe", "v-na", "v-shi", "v-shei"] },
  { id: "lesson-sb-10", unitId: "unit-sb", title: "Starter Checkpoint", orderIndex: 10, vocab: ["v-wo", "v-jiao", "v-zhongguo", "v-yi", "v-zhe", "v-nihao"], sentences: ["s-3", "s-6"] },
];
