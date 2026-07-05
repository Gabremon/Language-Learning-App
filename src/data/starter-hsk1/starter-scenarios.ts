import type { DialogueLine } from "@/types/exercises";

export interface StarterDialogueDef {
  id: string;
  /** Earliest starter lesson where this dialogue can appear. */
  fromLesson: string;
  lines: DialogueLine[];
  question: string;
  correctAnswer: string;
  /** Hanzi wrong answers — filled with teasers at generation time if short. */
  wrongAnswers: string[];
  explanation?: string;
}

export interface StarterYesNoDef {
  id: string;
  fromLesson: string;
  statement: string;
  statementPinyin?: string;
  claim: string;
  correctAnswer: "yes" | "no";
  explanation: string;
}

export const STARTER_DIALOGUES: StarterDialogueDef[] = [
  {
    id: "dlg-hello-reply",
    fromLesson: "lesson-sa-5",
    lines: [{ speaker: "A", hanzi: "你好！", pinyin: "Nǐ hǎo!" }],
    question: "How should you reply?",
    correctAnswer: "你好！",
    wrongAnswers: ["再见！", "谢谢！", "不客气。"],
    explanation: "你好 is the standard reply to 你好.",
  },
  {
    id: "dlg-goodbye-reply",
    fromLesson: "lesson-sa-6",
    lines: [{ speaker: "A", hanzi: "再见！", pinyin: "Zàijiàn!" }],
    question: "What do you say back?",
    correctAnswer: "再见！",
    wrongAnswers: ["你好！", "谢谢！", "我叫小明。"],
    explanation: "再见 is answered with 再见.",
  },
  {
    id: "dlg-thanks-reply",
    fromLesson: "lesson-sa-7",
    lines: [{ speaker: "A", hanzi: "谢谢！", pinyin: "Xièxie!" }],
    question: "Choose the polite reply.",
    correctAnswer: "不客气。",
    wrongAnswers: ["谢谢！", "你好！", "再见！"],
    explanation: "不客气 means you're welcome.",
  },
  {
    id: "dlg-name-ask",
    fromLesson: "lesson-sa-8",
    lines: [{ speaker: "A", hanzi: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?" }],
    question: "How might you answer?",
    correctAnswer: "我叫小明。",
    wrongAnswers: ["我是学生。", "你好！", "我来自美国。"],
    explanation: "我叫… introduces your name.",
  },
  {
    id: "dlg-name-exchange",
    fromLesson: "lesson-sa-8",
    lines: [
      { speaker: "A", hanzi: "你好！我叫小明。", pinyin: "Nǐ hǎo! Wǒ jiào Xiǎomíng." },
      { speaker: "B", hanzi: "你好！我叫…", pinyin: "Nǐ hǎo! Wǒ jiào…" },
    ],
    question: "Complete your reply first.",
    correctAnswer: "你好！",
    wrongAnswers: ["再见！", "谢谢！", "不客气。"],
    explanation: "Greet back, then share your name.",
  },
  {
    id: "dlg-student-question",
    fromLesson: "lesson-sa-9",
    lines: [{ speaker: "A", hanzi: "你是学生吗？", pinyin: "Nǐ shì xuéshēng ma?" }],
    question: "Choose a natural reply if you ARE a student.",
    correctAnswer: "我是学生。",
    wrongAnswers: ["我叫小明。", "你好！", "谢谢！"],
    explanation: "Answer a 吗-question with 是 or 不是.",
  },
  {
    id: "dlg-from-where",
    fromLesson: "lesson-sb-2",
    lines: [{ speaker: "A", hanzi: "你从哪里来？", pinyin: "Nǐ cóng nǎlǐ lái?" }],
    question: "How do you say you come from the U.S.?",
    correctAnswer: "我来自美国。",
    wrongAnswers: ["我是学生。", "你好！", "我叫小明。"],
    explanation: "我来自 + country tells where you come from.",
  },
  {
    id: "dlg-teacher-student",
    fromLesson: "lesson-sb-3",
    lines: [{ speaker: "A", hanzi: "你是老师吗？", pinyin: "Nǐ shì lǎoshī ma?" }],
    question: "Pick the best reply if you are NOT a teacher.",
    correctAnswer: "我不是老师。",
    wrongAnswers: ["我是学生。", "你好！", "谢谢！"],
    explanation: "我不是… means I am not…",
  },
  {
    id: "dlg-how-old",
    fromLesson: "lesson-sb-8",
    lines: [{ speaker: "A", hanzi: "你几岁？", pinyin: "Nǐ jǐ suì?" }],
    question: "Choose a reasonable answer.",
    correctAnswer: "我二十岁。",
    wrongAnswers: ["我是学生。", "你好！", "我来自美国。"],
    explanation: "我 + number + 岁 gives your age.",
  },
  {
    id: "dlg-greeting-review",
    fromLesson: "lesson-sa-10",
    lines: [{ speaker: "A", hanzi: "你好！你叫什么名字？", pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzi?" }],
    question: "How do you introduce yourself?",
    correctAnswer: "我叫小明。",
    wrongAnswers: ["再见！", "不客气。", "我是美国。"],
    explanation: "Use 我叫 + name after a greeting.",
  },
  {
    id: "dlg-checkpoint-intro",
    fromLesson: "lesson-sb-10",
    lines: [
      { speaker: "A", hanzi: "你好！你是学生吗？", pinyin: "Nǐ hǎo! Nǐ shì xuéshéng ma?" },
      { speaker: "B", hanzi: "…", pinyin: "…" },
    ],
    question: "Complete the reply: yes, I am a student.",
    correctAnswer: "我是学生。",
    wrongAnswers: ["我不是学生。", "你好！", "谢谢！"],
    explanation: "我是学生 answers yes to 你是学生吗.",
  },
];

export const STARTER_YES_NO: StarterYesNoDef[] = [
  {
    id: "yn-hello",
    fromLesson: "lesson-sa-5",
    statement: "你好！",
    statementPinyin: "Nǐ hǎo!",
    claim: "This means hello.",
    correctAnswer: "yes",
    explanation: "你好 means hello.",
  },
  {
    id: "yn-goodbye-is-hello",
    fromLesson: "lesson-sa-6",
    statement: "再见！",
    statementPinyin: "Zàijiàn!",
    claim: "This means hello.",
    correctAnswer: "no",
    explanation: "再见 means goodbye, not hello.",
  },
  {
    id: "yn-thanks",
    fromLesson: "lesson-sa-7",
    statement: "谢谢！",
    statementPinyin: "Xièxie!",
    claim: "This expresses thanks.",
    correctAnswer: "yes",
    explanation: "谢谢 means thank you.",
  },
  {
    id: "yn-name-statement",
    fromLesson: "lesson-sa-8",
    statement: "我叫小明。",
    statementPinyin: "Wǒ jiào Xiǎomíng.",
    claim: "Someone is introducing their name.",
    correctAnswer: "yes",
    explanation: "我叫… means My name is…",
  },
  {
    id: "yn-student",
    fromLesson: "lesson-sa-9",
    statement: "我是学生。",
    statementPinyin: "Wǒ shì xuéshēng.",
    claim: "This means I am a student.",
    correctAnswer: "yes",
    explanation: "我是学生 means I am a student.",
  },
  {
    id: "yn-question-particle",
    fromLesson: "lesson-sa-9",
    statement: "你是学生吗？",
    statementPinyin: "Nǐ shì xuéshēng ma?",
    claim: "This is a yes/no question.",
    correctAnswer: "yes",
    explanation: "吗 at the end turns a statement into a yes/no question.",
  },
  {
    id: "yn-teacher-meaning",
    fromLesson: "lesson-sb-3",
    statement: "我是老师。",
    statementPinyin: "Wǒ shì lǎoshī.",
    claim: "This means I am a teacher.",
    correctAnswer: "yes",
    explanation: "我是老师 is valid Chinese meaning I am a teacher.",
  },
  {
    id: "yn-from-us",
    fromLesson: "lesson-sb-2",
    statement: "我来自美国。",
    statementPinyin: "Wǒ láizì Měiguó.",
    claim: "This means I come from the United States.",
    correctAnswer: "yes",
    explanation: "我来自美国 means I come from the U.S.",
  },
  {
    id: "yn-two-is-three",
    fromLesson: "lesson-sb-4",
    statement: "三",
    statementPinyin: "sān",
    claim: "This means two.",
    correctAnswer: "no",
    explanation: "三 is three. 二 is two.",
  },
  {
    id: "yn-age-question",
    fromLesson: "lesson-sb-8",
    statement: "你几岁？",
    statementPinyin: "Nǐ jǐ suì?",
    claim: "This asks how old someone is.",
    correctAnswer: "yes",
    explanation: "你几岁？ asks How old are you?",
  },
  {
    id: "yn-this-student",
    fromLesson: "lesson-sb-9",
    statement: "这是学生。",
    statementPinyin: "Zhè shì xuéshēng.",
    claim: "This means This is a student.",
    correctAnswer: "yes",
    explanation: "这是… means This is…",
  },
  {
    id: "yn-checkpoint-greeting",
    fromLesson: "lesson-sb-10",
    statement: "你好！我来自中国。",
    statementPinyin: "Nǐ hǎo! Wǒ láizì Zhōngguó.",
    claim: "This is a greeting plus I come from China.",
    correctAnswer: "yes",
    explanation: "A natural short self-introduction opening.",
  },
];

const STARTER_LESSON_ORDER = [
  "lesson-sa-1", "lesson-sa-2", "lesson-sa-3", "lesson-sa-4", "lesson-sa-5",
  "lesson-sa-6", "lesson-sa-7", "lesson-sa-8", "lesson-sa-9", "lesson-sa-10",
  "lesson-sb-1", "lesson-sb-2", "lesson-sb-3", "lesson-sb-4", "lesson-sb-5",
  "lesson-sb-6", "lesson-sb-7", "lesson-sb-8", "lesson-sb-9", "lesson-sb-10",
];

function lessonIndex(lessonId: string): number {
  return STARTER_LESSON_ORDER.indexOf(lessonId);
}

export function getStarterDialoguesForLesson(lessonId: string): StarterDialogueDef[] {
  const index = lessonIndex(lessonId);
  if (index < 0) return [];
  return STARTER_DIALOGUES.filter((dialogue) => lessonIndex(dialogue.fromLesson) <= index);
}

export function getStarterYesNoForLesson(lessonId: string): StarterYesNoDef[] {
  const index = lessonIndex(lessonId);
  if (index < 0) return [];
  return STARTER_YES_NO.filter((item) => lessonIndex(item.fromLesson) <= index);
}
