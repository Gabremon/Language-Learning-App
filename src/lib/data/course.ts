import "server-only";

import type { Course, Lesson, VocabItem } from "@/types/course";
import type { BaseExercise, ExercisePayload } from "@/types/exercises";
import type { CourseCatalog, LessonBundle } from "@/lib/course-utils";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type { CourseCatalog, LessonBundle };

function requireSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env"
    );
  }
}

function mapCourse(row: {
  id: string;
  title: string;
  language_code: string;
}): Course {
  return {
    id: row.id,
    title: row.title,
    languageCode: row.language_code,
  };
}

function mapUnit(row: {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
}) {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    orderIndex: row.order_index,
  };
}

function mapLesson(row: {
  id: string;
  unit_id: string;
  title: string;
  order_index: number;
}): Lesson {
  return {
    id: row.id,
    unitId: row.unit_id,
    title: row.title,
    orderIndex: row.order_index,
  };
}

function mapVocab(row: {
  id: string;
  course_id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  part_of_speech: string | null;
  difficulty: number | null;
}): VocabItem {
  return {
    id: row.id,
    courseId: row.course_id,
    hanzi: row.hanzi,
    pinyin: row.pinyin,
    english: row.english,
    partOfSpeech: row.part_of_speech ?? "",
    difficulty: row.difficulty ?? 1,
  };
}

function mapExercise(row: {
  id: string;
  lesson_id: string;
  type: string;
  prompt: string;
  payload_json: ExercisePayload;
  explanation: string | null;
  order_index: number;
}): BaseExercise {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    type: row.type as BaseExercise["type"],
    prompt: row.prompt,
    payload: row.payload_json,
    orderIndex: row.order_index,
    explanation: row.explanation ?? undefined,
  };
}

export async function getCourseCatalog(): Promise<CourseCatalog> {
  requireSupabase();
  const supabase = await createClient();

  const [courseRes, unitsRes, lessonsRes] = await Promise.all([
    supabase.from("courses").select("id, title, language_code").limit(1).maybeSingle(),
    supabase
      .from("units")
      .select("id, course_id, title, order_index")
      .order("order_index"),
    supabase
      .from("lessons")
      .select("id, unit_id, title, order_index")
      .order("order_index"),
  ]);

  if (courseRes.error) {
    throw new Error(`Failed to load course: ${courseRes.error.message}`);
  }
  if (unitsRes.error) {
    throw new Error(`Failed to load units: ${unitsRes.error.message}`);
  }
  if (lessonsRes.error) {
    throw new Error(`Failed to load lessons: ${lessonsRes.error.message}`);
  }
  if (!courseRes.data) {
    throw new Error("No course found in database. Run supabase/setup.sql in the SQL Editor.");
  }

  return {
    course: mapCourse(courseRes.data),
    units: (unitsRes.data ?? []).map(mapUnit),
    lessons: (lessonsRes.data ?? []).map(mapLesson),
  };
}

export async function getAllVocab(): Promise<VocabItem[]> {
  requireSupabase();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocab_items")
    .select("id, course_id, hanzi, pinyin, english, part_of_speech, difficulty")
    .order("hanzi");

  if (error) {
    throw new Error(`Failed to load vocabulary: ${error.message}`);
  }

  return (data ?? []).map(mapVocab);
}

export async function getLessonBundle(lessonId: string): Promise<LessonBundle> {
  requireSupabase();
  const supabase = await createClient();

  const [lessonRes, exercisesRes, vocabRes] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, unit_id, title, order_index")
      .eq("id", lessonId)
      .maybeSingle(),
    supabase
      .from("exercises")
      .select("id, lesson_id, type, prompt, payload_json, explanation, order_index")
      .eq("lesson_id", lessonId)
      .order("order_index"),
    supabase
      .from("lesson_vocab")
      .select("vocab_items(id, course_id, hanzi, pinyin, english, part_of_speech, difficulty)")
      .eq("lesson_id", lessonId),
  ]);

  if (lessonRes.error) {
    throw new Error(`Failed to load lesson: ${lessonRes.error.message}`);
  }
  if (exercisesRes.error) {
    throw new Error(`Failed to load exercises: ${exercisesRes.error.message}`);
  }
  if (vocabRes.error) {
    throw new Error(`Failed to load lesson vocabulary: ${vocabRes.error.message}`);
  }

  const vocab = (vocabRes.data ?? [])
    .map((row) => {
      const raw = row.vocab_items as {
        id: string;
        course_id: string;
        hanzi: string;
        pinyin: string;
        english: string;
        part_of_speech: string | null;
        difficulty: number | null;
      } | null;
      return raw ? mapVocab(raw) : null;
    })
    .filter((item): item is VocabItem => item != null);

  return {
    lesson: lessonRes.data ? mapLesson(lessonRes.data) : null,
    exercises: (exercisesRes.data ?? []).map(mapExercise),
    vocab,
  };
}
