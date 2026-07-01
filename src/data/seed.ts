import type { Course, Lesson, Sentence, Unit, VocabItem } from "@/types/course";
import type { BaseExercise } from "@/types/exercises";

export const COURSE_ID = "course-mandarin-1";

export const course: Course = {
  id: COURSE_ID,
  title: "Mandarin Chinese",
  languageCode: "zh-CN",
};

export const units: Unit[] = [
  { id: "unit-1", courseId: COURSE_ID, title: "Basics", orderIndex: 1 },
  { id: "unit-2", courseId: COURSE_ID, title: "Food", orderIndex: 2 },
  { id: "unit-3", courseId: COURSE_ID, title: "Family", orderIndex: 3 },
];

export const lessons: Lesson[] = [
  { id: "lesson-1-1", unitId: "unit-1", title: "I, you, he/she, to be", orderIndex: 1 },
  { id: "lesson-1-2", unitId: "unit-1", title: "Students and teachers", orderIndex: 2 },
  { id: "lesson-1-3", unitId: "unit-1", title: "Countries and nationalities", orderIndex: 3 },
  { id: "lesson-1-4", unitId: "unit-1", title: "Yes/no questions", orderIndex: 4 },
  { id: "lesson-2-1", unitId: "unit-2", title: "Water, tea, rice, noodles", orderIndex: 1 },
  { id: "lesson-2-2", unitId: "unit-2", title: "Like and dislike", orderIndex: 2 },
  { id: "lesson-2-3", unitId: "unit-2", title: "Ordering food", orderIndex: 3 },
  { id: "lesson-3-1", unitId: "unit-3", title: "Mom, dad, siblings", orderIndex: 1 },
  { id: "lesson-3-2", unitId: "unit-3", title: "My family", orderIndex: 2 },
  { id: "lesson-3-3", unitId: "unit-3", title: "Simple descriptions", orderIndex: 3 },
];

export const vocabItems: VocabItem[] = [
  // Unit 1 Lesson 1
  { id: "v-wo", courseId: COURSE_ID, hanzi: "我", pinyin: "wǒ", english: "I / me", partOfSpeech: "pronoun", difficulty: 1 },
  { id: "v-ni", courseId: COURSE_ID, hanzi: "你", pinyin: "nǐ", english: "you", partOfSpeech: "pronoun", difficulty: 1 },
  { id: "v-ta-he", courseId: COURSE_ID, hanzi: "他", pinyin: "tā", english: "he / him", partOfSpeech: "pronoun", difficulty: 1 },
  { id: "v-ta-she", courseId: COURSE_ID, hanzi: "她", pinyin: "tā", english: "she / her", partOfSpeech: "pronoun", difficulty: 1 },
  { id: "v-shi", courseId: COURSE_ID, hanzi: "是", pinyin: "shì", english: "to be", partOfSpeech: "verb", difficulty: 1 },
  // Unit 1 Lesson 2
  { id: "v-xuesheng", courseId: COURSE_ID, hanzi: "学生", pinyin: "xuéshēng", english: "student", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-laoshi", courseId: COURSE_ID, hanzi: "老师", pinyin: "lǎoshī", english: "teacher", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-tongxue", courseId: COURSE_ID, hanzi: "同学", pinyin: "tóngxué", english: "classmate", partOfSpeech: "noun", difficulty: 2 },
  { id: "v-xuexiao", courseId: COURSE_ID, hanzi: "学校", pinyin: "xuéxiào", english: "school", partOfSpeech: "noun", difficulty: 2 },
  // Unit 1 Lesson 3
  { id: "v-zhongguo", courseId: COURSE_ID, hanzi: "中国", pinyin: "Zhōngguó", english: "China", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-meiguo", courseId: COURSE_ID, hanzi: "美国", pinyin: "Měiguó", english: "United States", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-ren", courseId: COURSE_ID, hanzi: "人", pinyin: "rén", english: "person", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-zhongguoren", courseId: COURSE_ID, hanzi: "中国人", pinyin: "Zhōngguórén", english: "Chinese person", partOfSpeech: "noun", difficulty: 2 },
  // Unit 1 Lesson 4
  { id: "v-ma", courseId: COURSE_ID, hanzi: "吗", pinyin: "ma", english: "question particle", partOfSpeech: "particle", difficulty: 2 },
  { id: "v-bu", courseId: COURSE_ID, hanzi: "不", pinyin: "bù", english: "not / no", partOfSpeech: "adverb", difficulty: 1 },
  { id: "v-hao", courseId: COURSE_ID, hanzi: "好", pinyin: "hǎo", english: "good", partOfSpeech: "adjective", difficulty: 1 },
  // Unit 2 Lesson 1
  { id: "v-shui", courseId: COURSE_ID, hanzi: "水", pinyin: "shuǐ", english: "water", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-cha", courseId: COURSE_ID, hanzi: "茶", pinyin: "chá", english: "tea", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-mifan", courseId: COURSE_ID, hanzi: "米饭", pinyin: "mǐfàn", english: "rice", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-miantiao", courseId: COURSE_ID, hanzi: "面条", pinyin: "miàntiáo", english: "noodles", partOfSpeech: "noun", difficulty: 2 },
  // Unit 2 Lesson 2
  { id: "v-xihuan", courseId: COURSE_ID, hanzi: "喜欢", pinyin: "xǐhuān", english: "to like", partOfSpeech: "verb", difficulty: 1 },
  { id: "v-buxihuan", courseId: COURSE_ID, hanzi: "不喜欢", pinyin: "bù xǐhuān", english: "to not like", partOfSpeech: "verb", difficulty: 2 },
  // Unit 2 Lesson 3
  { id: "v-qing", courseId: COURSE_ID, hanzi: "请", pinyin: "qǐng", english: "please", partOfSpeech: "verb", difficulty: 1 },
  { id: "v-yao", courseId: COURSE_ID, hanzi: "要", pinyin: "yào", english: "to want", partOfSpeech: "verb", difficulty: 1 },
  { id: "v-chi", courseId: COURSE_ID, hanzi: "吃", pinyin: "chī", english: "to eat", partOfSpeech: "verb", difficulty: 1 },
  { id: "v-he", courseId: COURSE_ID, hanzi: "喝", pinyin: "hē", english: "to drink", partOfSpeech: "verb", difficulty: 1 },
  // Unit 3 Lesson 1
  { id: "v-mama", courseId: COURSE_ID, hanzi: "妈妈", pinyin: "māma", english: "mom", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-baba", courseId: COURSE_ID, hanzi: "爸爸", pinyin: "bàba", english: "dad", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-gege", courseId: COURSE_ID, hanzi: "哥哥", pinyin: "gēge", english: "older brother", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-meimei", courseId: COURSE_ID, hanzi: "妹妹", pinyin: "mèimei", english: "younger sister", partOfSpeech: "noun", difficulty: 1 },
  // Unit 3 Lesson 2
  { id: "v-jia", courseId: COURSE_ID, hanzi: "家", pinyin: "jiā", english: "family / home", partOfSpeech: "noun", difficulty: 1 },
  { id: "v-de", courseId: COURSE_ID, hanzi: "的", pinyin: "de", english: "possessive particle", partOfSpeech: "particle", difficulty: 2 },
  // Unit 3 Lesson 3
  { id: "v-hen", courseId: COURSE_ID, hanzi: "很", pinyin: "hěn", english: "very", partOfSpeech: "adverb", difficulty: 1 },
  { id: "v-da", courseId: COURSE_ID, hanzi: "大", pinyin: "dà", english: "big", partOfSpeech: "adjective", difficulty: 1 },
  { id: "v-xiao", courseId: COURSE_ID, hanzi: "小", pinyin: "xiǎo", english: "small", partOfSpeech: "adjective", difficulty: 1 },
];

export const lessonVocabMap: Record<string, string[]> = {
  "lesson-1-1": ["v-wo", "v-ni", "v-ta-he", "v-ta-she", "v-shi"],
  "lesson-1-2": ["v-xuesheng", "v-laoshi", "v-tongxue", "v-xuexiao", "v-shi"],
  "lesson-1-3": ["v-zhongguo", "v-meiguo", "v-ren", "v-zhongguoren", "v-shi"],
  "lesson-1-4": ["v-ma", "v-bu", "v-hao", "v-shi", "v-ni"],
  "lesson-2-1": ["v-shui", "v-cha", "v-mifan", "v-miantiao", "v-he"],
  "lesson-2-2": ["v-xihuan", "v-buxihuan", "v-cha", "v-mifan", "v-chi"],
  "lesson-2-3": ["v-qing", "v-yao", "v-chi", "v-he", "v-mifan"],
  "lesson-3-1": ["v-mama", "v-baba", "v-gege", "v-meimei", "v-de"],
  "lesson-3-2": ["v-jia", "v-de", "v-mama", "v-baba", "v-wo"],
  "lesson-3-3": ["v-hen", "v-da", "v-xiao", "v-hao", "v-jia"],
};

export const sentences: Sentence[] = [
  { id: "s-1", courseId: COURSE_ID, hanzi: "我是学生。", pinyin: "Wǒ shì xuéshēng.", english: "I am a student.", difficulty: 1, grammarNotes: "Subject + 是 + noun" },
  { id: "s-2", courseId: COURSE_ID, hanzi: "她是老师。", pinyin: "Tā shì lǎoshī.", english: "She is a teacher.", difficulty: 1 },
  { id: "s-3", courseId: COURSE_ID, hanzi: "你是中国人吗？", pinyin: "Nǐ shì Zhōngguórén ma?", english: "Are you Chinese?", difficulty: 2, grammarNotes: "Add 吗 at the end for yes/no questions" },
  { id: "s-4", courseId: COURSE_ID, hanzi: "我喜欢喝茶。", pinyin: "Wǒ xǐhuān hē chá.", english: "I like to drink tea.", difficulty: 2 },
  { id: "s-5", courseId: COURSE_ID, hanzi: "请给我米饭。", pinyin: "Qǐng gěi wǒ mǐfàn.", english: "Please give me rice.", difficulty: 2 },
  { id: "s-6", courseId: COURSE_ID, hanzi: "我的妈妈很好。", pinyin: "Wǒ de māma hěn hǎo.", english: "My mom is very good.", difficulty: 2, grammarNotes: "的 marks possession" },
  { id: "s-7", courseId: COURSE_ID, hanzi: "我家很大。", pinyin: "Wǒ jiā hěn dà.", english: "My family/home is very big.", difficulty: 2 },
];

export const lessonSentenceMap: Record<string, string[]> = {
  "lesson-1-1": [],
  "lesson-1-2": ["s-1", "s-2"],
  "lesson-1-3": ["s-3"],
  "lesson-1-4": ["s-3"],
  "lesson-2-1": [],
  "lesson-2-2": ["s-4"],
  "lesson-2-3": ["s-5"],
  "lesson-3-1": [],
  "lesson-3-2": ["s-6"],
  "lesson-3-3": ["s-7"],
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr];
  let state = hashString(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getVocab(ids: string[]): VocabItem[] {
  return ids.map((id) => vocabItems.find((v) => v.id === id)!).filter(Boolean);
}

function distractors(
  target: VocabItem,
  pool: VocabItem[],
  field: "english" | "hanzi" | "pinyin",
  seed: string,
  count = 3
): string[] {
  const seen = new Set<string>([target[field]]);
  const result: string[] = [];
  for (const v of seededShuffle(
    pool.filter((item) => item.id !== target.id),
    seed
  )) {
    const value = v[field];
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
    if (result.length >= count) break;
  }
  return result;
}

function buildShuffledOptions(correct: string, wrong: string[], seed: string): string[] {
  const seen = new Set<string>();
  const unique = [correct, ...wrong].filter((option) => {
    if (seen.has(option)) return false;
    seen.add(option);
    return true;
  });
  return seededShuffle(unique, seed);
}

function buildExercisesForLesson(lessonId: string, vocabIds: string[]): BaseExercise[] {
  const vocab = getVocab(vocabIds);
  const exercises: BaseExercise[] = [];
  let order = 0;
  const add = (type: BaseExercise["type"], prompt: string, payload: BaseExercise["payload"], explanation?: string) => {
    exercises.push({
      id: `${lessonId}-ex-${order}`,
      lessonId,
      type,
      prompt,
      payload,
      orderIndex: order++,
      explanation,
    });
  };

  vocab.forEach((v) => {
    add("multiple_choice", "Select the correct translation", {
      question: `What does "${v.hanzi}" mean?`,
      options: buildShuffledOptions(
        v.english,
        distractors(v, vocab, "english", `${lessonId}-${v.id}-mc-d`),
        `${lessonId}-${v.id}-mc`
      ),
      correctAnswer: v.english,
      displayHanzi: v.hanzi,
    }, `${v.hanzi} (${v.pinyin}) means "${v.english}".`);

    add("hanzi_to_english", "Type the English meaning", {
      hanzi: v.hanzi,
      pinyin: v.pinyin,
      acceptedAnswers: [v.english, v.english.split("/")[0].trim()],
    }, `${v.hanzi} = ${v.english}`);

    add("pinyin_recognition", "Select the correct pinyin", {
      hanzi: v.hanzi,
      options: buildShuffledOptions(
        v.pinyin,
        distractors(v, vocab, "pinyin", `${lessonId}-${v.id}-py-d`),
        `${lessonId}-${v.id}-py`
      ),
      correctAnswer: v.pinyin,
    }, `${v.hanzi} is pronounced ${v.pinyin}.`);

    add("reverse_pinyin", "Which hanzi matches this pinyin?", {
      pinyin: v.pinyin,
      options: buildShuffledOptions(
        v.hanzi,
        distractors(v, vocab, "hanzi", `${lessonId}-${v.id}-rp-d`),
        `${lessonId}-${v.id}-rp`
      ),
      correctAnswer: v.hanzi,
    }, `${v.pinyin} → ${v.hanzi}`);
  });

  if (vocab.length >= 4) {
    const pairVocab = vocab.slice(0, 4);
    add("match_pairs", "Match each hanzi to its meaning", {
      pairs: pairVocab.map((v) => ({
        id: v.id,
        left: v.hanzi,
        right: v.english.split("/")[0].trim(),
      })),
    });
  }

  vocab.slice(0, 2).forEach((v) => {
    const chars = v.hanzi.split("");
    const decoys = seededShuffle(
      vocab
        .filter((x) => x.id !== v.id)
        .flatMap((x) => x.hanzi.split("")),
      `${lessonId}-${v.id}-wb-d`
    ).slice(0, Math.max(4, 10 - chars.length));
    add("english_to_hanzi_word_bank", "Build the hanzi for this word", {
      english: v.english.split("/")[0].trim(),
      wordBank: seededShuffle([...chars, ...decoys], `${lessonId}-${v.id}-wb`),
      correctAnswer: chars,
    }, `The hanzi for "${v.english}" is ${v.hanzi}.`);

    add("listening", "Listen and select the meaning", {
      hanzi: v.hanzi,
      options: buildShuffledOptions(
        v.english,
        distractors(v, vocab, "english", `${lessonId}-${v.id}-li-d`),
        `${lessonId}-${v.id}-li`
      ),
      correctAnswer: v.english,
    }, `You heard: ${v.hanzi} (${v.pinyin})`);
  });

  const sentenceIds = lessonSentenceMap[lessonId] ?? [];
  sentenceIds.forEach((sid) => {
    const s = sentences.find((x) => x.id === sid)!;
    const parts = s.hanzi.replace("。", "").split("");
    const blankIdx = parts.findIndex((c) => c !== "我" && c !== "是" && c.length === 1);
    if (blankIdx >= 0) {
      const blankChar = parts[blankIdx];
      const display = parts.map((c, i) => (i === blankIdx ? "___" : c)).join("") + "。";
      add("fill_in_blank", "Fill in the missing character", {
        sentence: display,
        blankIndex: blankIdx,
        correctAnswer: blankChar,
        fullSentence: s.hanzi,
        fullPinyin: s.pinyin,
        options: buildShuffledOptions(
          blankChar,
          seededShuffle(
            vocab.map((item) => item.hanzi[0]),
            `${lessonId}-${sid}-fib-d`
          )
            .filter((c) => c !== blankChar)
            .filter((c, i, arr) => arr.indexOf(c) === i)
            .slice(0, 3),
          `${lessonId}-${sid}-fib`
        ),
      }, s.grammarNotes ?? `Full sentence: ${s.hanzi} — ${s.english}`);
    }
  });

  return exercises.slice(0, 14);
}

export const exercises: BaseExercise[] = Object.entries(lessonVocabMap).flatMap(
  ([lessonId, vocabIds]) => buildExercisesForLesson(lessonId, vocabIds)
);

export function getLessonById(lessonId: string) {
  return lessons.find((l) => l.id === lessonId);
}

export function getUnitById(unitId: string) {
  return units.find((u) => u.id === unitId);
}

export function getLessonsForUnit(unitId: string) {
  return lessons.filter((l) => l.unitId === unitId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getExercisesForLesson(lessonId: string) {
  return exercises.filter((e) => e.lessonId === lessonId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getVocabForLesson(lessonId: string) {
  const ids = lessonVocabMap[lessonId] ?? [];
  return ids.map((id) => vocabItems.find((v) => v.id === id)!).filter(Boolean);
}

export function getAllVocab() {
  return vocabItems;
}

export function getNextLesson(currentLessonId: string): Lesson | null {
  const idx = lessons.findIndex((l) => l.id === currentLessonId);
  if (idx < 0 || idx >= lessons.length - 1) return null;
  return lessons[idx + 1];
}

export function isLessonUnlocked(lessonId: string, completedIds: string[]): boolean {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  const unitLessons = getLessonsForUnit(lesson.unitId);
  const lessonIdx = unitLessons.findIndex((l) => l.id === lessonId);
  if (lessonIdx === 0) {
    const unitIdx = units.findIndex((u) => u.id === lesson.unitId);
    if (unitIdx === 0) return true;
    const prevUnit = units[unitIdx - 1];
    const prevUnitLessons = getLessonsForUnit(prevUnit.id);
    return prevUnitLessons.every((l) => completedIds.includes(l.id));
  }
  return completedIds.includes(unitLessons[lessonIdx - 1].id);
}
