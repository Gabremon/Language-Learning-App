import type { Lesson, Sentence, Unit } from "@/types/course";
import { COURSE_ID } from "./constants";
import { UNIT_DEFS } from "./units";
import { LESSON_CATALOG } from "./lesson-catalog";
import { STARTER_SENTENCES } from "./starter-sentences";

export const units: Unit[] = UNIT_DEFS.map((u) => ({
  id: u.id,
  courseId: COURSE_ID,
  title: u.title,
  orderIndex: u.orderIndex,
}));

export const lessons: Lesson[] = LESSON_CATALOG.map(({ id, unitId, title, orderIndex }) => ({
  id,
  unitId,
  title,
  orderIndex,
}));

export const sentences: Sentence[] = [
  { id: "s-1", courseId: COURSE_ID, hanzi: "你好！", pinyin: "Nǐ hǎo!", english: "Hello!", difficulty: 1 },
  { id: "s-2", courseId: COURSE_ID, hanzi: "再见！", pinyin: "Zàijiàn!", english: "Goodbye!", difficulty: 1 },
  { id: "s-3", courseId: COURSE_ID, hanzi: "我叫小明。", pinyin: "Wǒ jiào Xiǎomíng.", english: "My name is Xiaoming.", difficulty: 1, grammarNotes: "叫 + name introduces yourself" },
  { id: "s-4", courseId: COURSE_ID, hanzi: "我是学生。", pinyin: "Wǒ shì xuéshēng.", english: "I am a student.", difficulty: 1, grammarNotes: "Subject + 是 + noun" },
  { id: "s-5", courseId: COURSE_ID, hanzi: "你是中国人吗？", pinyin: "Nǐ shì Zhōngguórén ma?", english: "Are you Chinese?", difficulty: 2, grammarNotes: "Add 吗 for yes/no questions" },
  { id: "s-6", courseId: COURSE_ID, hanzi: "我来自美国。", pinyin: "Wǒ láizì Měiguó.", english: "I come from the United States.", difficulty: 2, grammarNotes: "来自 + place" },
  { id: "s-7", courseId: COURSE_ID, hanzi: "她是谁？", pinyin: "Tā shì shéi?", english: "Who is she?", difficulty: 2 },
  { id: "s-8", courseId: COURSE_ID, hanzi: "你几岁？", pinyin: "Nǐ jǐ suì?", english: "How old are you?", difficulty: 2, grammarNotes: "几 + 岁 for age" },
  { id: "s-9", courseId: COURSE_ID, hanzi: "我有一个哥哥。", pinyin: "Wǒ yǒu yī gè gēge.", english: "I have an older brother.", difficulty: 2, grammarNotes: "有 means to have; 个 is a measure word" },
  { id: "s-10", courseId: COURSE_ID, hanzi: "我的妈妈很好。", pinyin: "Wǒ de māma hěn hǎo.", english: "My mom is very good.", difficulty: 2, grammarNotes: "的 marks possession" },
  { id: "s-11", courseId: COURSE_ID, hanzi: "我妈妈是医生。", pinyin: "Wǒ māma shì yīshēng.", english: "My mom is a doctor.", difficulty: 2 },
  { id: "s-12", courseId: COURSE_ID, hanzi: "现在几点？", pinyin: "Xiànzài jǐ diǎn?", english: "What time is it now?", difficulty: 2 },
  { id: "s-13", courseId: COURSE_ID, hanzi: "今天星期一。", pinyin: "Jīntiān xīngqī yī.", english: "Today is Monday.", difficulty: 2 },
  { id: "s-14", courseId: COURSE_ID, hanzi: "我七点起床。", pinyin: "Wǒ qī diǎn qǐchuáng.", english: "I get up at seven o'clock.", difficulty: 2 },
  { id: "s-15", courseId: COURSE_ID, hanzi: "我喜欢喝茶。", pinyin: "Wǒ xǐhuān hē chá.", english: "I like to drink tea.", difficulty: 2 },
  { id: "s-16", courseId: COURSE_ID, hanzi: "请给我米饭。", pinyin: "Qǐng gěi wǒ mǐfàn.", english: "Please give me rice.", difficulty: 2 },
  { id: "s-17", courseId: COURSE_ID, hanzi: "我饿了，想吃饭。", pinyin: "Wǒ è le, xiǎng chī fàn.", english: "I'm hungry and want to eat.", difficulty: 2 },
  { id: "s-18", courseId: COURSE_ID, hanzi: "这个多少钱？", pinyin: "Zhège duōshao qián?", english: "How much is this?", difficulty: 2 },
  { id: "s-19", courseId: COURSE_ID, hanzi: "太贵了！", pinyin: "Tài guì le!", english: "Too expensive!", difficulty: 2 },
  { id: "s-20", courseId: COURSE_ID, hanzi: "我的家很大。", pinyin: "Wǒ de jiā hěn dà.", english: "My home is very big.", difficulty: 2 },
  { id: "s-21", courseId: COURSE_ID, hanzi: "手机在哪里？", pinyin: "Shǒujī zài nǎlǐ?", english: "Where is the phone?", difficulty: 2, grammarNotes: "在 + location" },
  { id: "s-22", courseId: COURSE_ID, hanzi: "今天天气很冷。", pinyin: "Jīntiān tiānqì hěn lěng.", english: "The weather is very cold today.", difficulty: 2 },
  { id: "s-23", courseId: COURSE_ID, hanzi: "你怎么去？", pinyin: "Nǐ zěnme qù?", english: "How do you get there?", difficulty: 2 },
  { id: "s-24", courseId: COURSE_ID, hanzi: "谢谢！不客气。", pinyin: "Xièxie! Bù kèqi.", english: "Thank you! You're welcome.", difficulty: 1 },
  ...STARTER_SENTENCES,
];
