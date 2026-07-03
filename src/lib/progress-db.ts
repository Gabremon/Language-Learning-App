import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProgress, LessonAttempt } from "@/lib/progress";
import type { VocabMemory } from "@/lib/srs";
import { createInitialVocabMemory } from "@/lib/srs";

export const DEFAULT_COURSE_ID = "course-mandarin-1";
export const DEFAULT_LESSON_ID = "lesson-sa-1";

const EMPTY_PROGRESS: UserProgress = {
  xp: 0,
  streakCount: 0,
  lastActiveDate: null,
  currentLessonId: DEFAULT_LESSON_ID,
  completedLessonIds: [],
  vocabMemory: {},
  lessonAttempts: [],
};

/** Lesson IDs from the expanded course catalog — skip DB round-trip on read. */
function isKnownLessonId(lessonId: string): boolean {
  return lessonId.startsWith("lesson-s") || lessonId.startsWith("lesson-h1-");
}

/** Ensure current_lesson_id references a real lesson (avoids FK errors after course migrations). */
let cachedFirstLessonId: string | null | undefined;

async function resolveCurrentLessonId(
  supabase: SupabaseClient,
  currentLessonId: string | null | undefined,
  { validateInDb }: { validateInDb: boolean }
): Promise<string | null> {
  if (currentLessonId && isKnownLessonId(currentLessonId)) {
    return currentLessonId;
  }

  if (!validateInDb) {
    if (currentLessonId && isKnownLessonId(currentLessonId)) return currentLessonId;
    return DEFAULT_LESSON_ID;
  }

  if (currentLessonId) {
    const { data, error } = await supabase
      .from("lessons")
      .select("id")
      .eq("id", currentLessonId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) return currentLessonId;
  }

  if (cachedFirstLessonId !== undefined) {
    return cachedFirstLessonId ?? DEFAULT_LESSON_ID;
  }

  const { data: first, error: firstError } = await supabase
    .from("lessons")
    .select("id")
    .order("order_index")
    .limit(1)
    .maybeSingle();

  if (firstError) throw new Error(firstError.message);
  cachedFirstLessonId = first?.id ?? null;
  return cachedFirstLessonId ?? DEFAULT_LESSON_ID;
}

function mapVocabMemoryRow(row: {
  vocab_item_id: string;
  strength: number | null;
  times_seen: number | null;
  times_correct: number | null;
  last_reviewed_at: string | null;
  next_review_at: string | null;
}): VocabMemory {
  return {
    vocabItemId: row.vocab_item_id,
    strength: row.strength ?? 0,
    timesSeen: row.times_seen ?? 0,
    timesCorrect: row.times_correct ?? 0,
    lastReviewedAt: row.last_reviewed_at,
    nextReviewAt: row.next_review_at,
  };
}

function mapLessonAttemptRow(row: {
  id: string;
  lesson_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}): LessonAttempt {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    score: row.score,
    totalQuestions: row.total_questions,
    completedAt: row.completed_at,
  };
}

export async function fetchUserProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProgress> {
  const [progressRes, attemptsRes, vocabRes] = await Promise.all([
    supabase
      .from("user_progress")
      .select("xp, streak_count, last_active_date, current_lesson_id")
      .eq("user_id", userId)
      .eq("course_id", DEFAULT_COURSE_ID)
      .maybeSingle(),
    supabase
      .from("lesson_attempts")
      .select("id, lesson_id, score, total_questions, completed_at")
      .eq("user_id", userId)
      .order("completed_at"),
    supabase
      .from("vocab_memory")
      .select(
        "vocab_item_id, strength, times_seen, times_correct, last_reviewed_at, next_review_at"
      )
      .eq("user_id", userId),
  ]);

  if (progressRes.error) throw new Error(progressRes.error.message);
  if (attemptsRes.error) throw new Error(attemptsRes.error.message);
  if (vocabRes.error) throw new Error(vocabRes.error.message);

  const lessonAttempts = (attemptsRes.data ?? []).map(mapLessonAttemptRow);
  const completedLessonIds = [...new Set(lessonAttempts.map((a) => a.lessonId))];

  const vocabMemory: Record<string, VocabMemory> = {};
  for (const row of vocabRes.data ?? []) {
    const memory = mapVocabMemoryRow(row);
    vocabMemory[memory.vocabItemId] = memory;
  }

  const row = progressRes.data;
  if (!row) {
    return {
      ...EMPTY_PROGRESS,
      currentLessonId: DEFAULT_LESSON_ID,
      lessonAttempts,
      completedLessonIds,
      vocabMemory,
    };
  }

  const currentLessonId = await resolveCurrentLessonId(supabase, row.current_lesson_id, {
    validateInDb: false,
  });

  return {
    xp: row.xp ?? 0,
    streakCount: row.streak_count ?? 0,
    lastActiveDate: row.last_active_date,
    currentLessonId: currentLessonId ?? DEFAULT_LESSON_ID,
    completedLessonIds,
    vocabMemory,
    lessonAttempts,
  };
}

export async function saveUserProgressState(
  supabase: SupabaseClient,
  userId: string,
  progress: UserProgress
): Promise<void> {
  const currentLessonId = await resolveCurrentLessonId(supabase, progress.currentLessonId, {
    validateInDb: true,
  });

  const { error: progressError } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      course_id: DEFAULT_COURSE_ID,
      current_lesson_id: currentLessonId,
      xp: progress.xp,
      streak_count: progress.streakCount,
      last_active_date: progress.lastActiveDate,
    },
    { onConflict: "user_id,course_id" }
  );

  if (progressError) throw new Error(progressError.message);

  const vocabRows = Object.values(progress.vocabMemory).map((memory) => ({
    user_id: userId,
    vocab_item_id: memory.vocabItemId,
    strength: memory.strength,
    times_seen: memory.timesSeen,
    times_correct: memory.timesCorrect,
    last_reviewed_at: memory.lastReviewedAt,
    next_review_at: memory.nextReviewAt,
  }));

  if (vocabRows.length > 0) {
    const { error: vocabError } = await supabase
      .from("vocab_memory")
      .upsert(vocabRows, { onConflict: "user_id,vocab_item_id" });
    if (vocabError) throw new Error(vocabError.message);
  }
}

export async function insertLessonAttempt(
  supabase: SupabaseClient,
  userId: string,
  lessonId: string,
  score: number,
  totalQuestions: number
): Promise<LessonAttempt> {
  const { data, error } = await supabase
    .from("lesson_attempts")
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      score,
      total_questions: totalQuestions,
    })
    .select("id, lesson_id, score, total_questions, completed_at")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to save lesson attempt");
  return mapLessonAttemptRow(data);
}

export async function resetUserProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const [attemptsError, vocabError, progressError] = await Promise.all([
    supabase.from("lesson_attempts").delete().eq("user_id", userId),
    supabase.from("vocab_memory").delete().eq("user_id", userId),
    supabase.from("user_progress").delete().eq("user_id", userId).eq("course_id", DEFAULT_COURSE_ID),
  ]);

  if (attemptsError.error) throw new Error(attemptsError.error.message);
  if (vocabError.error) throw new Error(vocabError.error.message);
  if (progressError.error) throw new Error(progressError.error.message);
}

export function getVocabMemoryFromProgress(
  progress: UserProgress,
  vocabItemId: string
): VocabMemory {
  return progress.vocabMemory[vocabItemId] ?? createInitialVocabMemory(vocabItemId);
}
