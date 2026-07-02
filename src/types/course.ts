export interface Course {
  id: string;
  title: string;
  languageCode: string;
}

export interface Unit {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  orderIndex: number;
}

export interface VocabItem {
  id: string;
  courseId: string;
  hanzi: string;
  pinyin: string;
  english: string;
  partOfSpeech: string;
  difficulty: number;
  imageUrl?: string;
  emoji?: string;
}

export interface Sentence {
  id: string;
  courseId: string;
  hanzi: string;
  pinyin: string;
  english: string;
  difficulty: number;
  grammarNotes?: string;
}

export interface LessonWithMeta extends Lesson {
  unitTitle: string;
  unitOrderIndex: number;
  vocab: VocabItem[];
  sentences: Sentence[];
}
