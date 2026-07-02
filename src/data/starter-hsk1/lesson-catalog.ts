export interface LessonDef {
  id: string;
  unitId: string;
  title: string;
  orderIndex: number;
  vocab: string[];
  sentences?: string[];
}

export {
  LESSON_CATALOG,
  LESSON_COUNT,
  LESSONS_PER_UNIT,
  HSK1_LESSON_COUNT,
  STARTER_LESSON_COUNT,
} from "./build-catalog";
