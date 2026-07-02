import type { VocabItem } from "@/types/course";
import { getVocabEmoji, getVocabImageUrl } from "@/lib/vocab-images";
import { COURSE_ID } from "./constants";
import { HSK1_ALL_WORDS } from "./hsk1-vocab-data";

function v(
  id: string,
  hanzi: string,
  pinyin: string,
  english: string,
  partOfSpeech: string,
  difficulty: number
): VocabItem {
  return {
    id,
    courseId: COURSE_ID,
    hanzi,
    pinyin,
    english,
    partOfSpeech,
    difficulty,
    emoji: getVocabEmoji(id),
    imageUrl: getVocabImageUrl(id),
  };
}

/** Tone-drill characters (Starter only, not HSK 1 exam vocabulary). */
const STARTER_TONE_VOCAB: VocabItem[] = [
  v("v-ma-mother", "妈", "mā", "mother (tone 1)", "noun", 1),
  v("v-ma-hemp", "麻", "má", "hemp (tone 2)", "noun", 1),
  v("v-ma-horse", "马", "mǎ", "horse (tone 3)", "noun", 1),
  v("v-ma-scold", "骂", "mà", "to scold (tone 4)", "verb", 1),
  v("v-laizi", "来自", "láizì", "to come from", "verb", 2),
  v("v-duoda", "多大", "duō dà", "how old", "question", 2),
  v("v-zhongguoren", "中国人", "Zhōngguórén", "Chinese person", "noun", 2),
  v("v-buxihuan", "不喜欢", "bù xǐhuān", "to not like", "verb", 2),
  v("v-caidan", "菜单", "càidān", "menu", "noun", 2),
  v("v-fuwuyuan", "服务员", "fúwùyuán", "waiter / server", "noun", 2),
  v("v-maidan", "买单", "mǎidān", "to pay the bill", "verb", 2),
  v("v-xie", "些", "xiē", "some", "measure", 2),
  v("v-bao-full", "饱", "bǎo", "full (not hungry)", "adjective", 2),
  v("v-e", "饿", "è", "hungry", "adjective", 2),
  v("v-ke-thirsty", "渴", "kě", "thirsty", "adjective", 2),
  v("v-hao-date", "号", "hào", "date (day of month)", "noun", 2),
  v("v-shihou", "时候", "shíhou", "time / when", "noun", 2),
  v("v-cong", "从", "cóng", "from", "preposition", 2),
  v("v-mei", "每", "měi", "every", "adjective", 2),
  v("v-haishi", "还是", "háishi", "or / still", "conjunction", 2),
  v("v-na-which", "哪", "nǎ", "which", "pronoun", 2),
  v("v-hushi", "护士", "hùshi", "nurse", "noun", 2),
];

/** Full HSK 1 vocabulary (274 unique words) + starter tone extras. */
export const vocabItems: VocabItem[] = (() => {
  const byId = new Map<string, VocabItem>();

  for (const word of HSK1_ALL_WORDS) {
    byId.set(word.id, v(word.id, word.hanzi, word.pinyin, word.english, word.partOfSpeech, 1));
  }

  for (const word of STARTER_TONE_VOCAB) {
    if (!byId.has(word.id)) {
      byId.set(word.id, word);
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.hanzi.localeCompare(b.hanzi, "zh"));
})();

export const vocabById = Object.fromEntries(vocabItems.map((item) => [item.id, item])) as Record<
  string,
  VocabItem
>;

export const VOCAB_COUNT = vocabItems.length;
