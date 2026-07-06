import "server-only";

import { createServiceClient } from "@/lib/supabase/admin";

export interface AnalyticsSnapshot {
  generatedAt: string;
  totalUsers: number;
  totalLessonAttempts: number;
  uniqueLessonsCompleted: number;
  activeToday: number;
  activeLast7Days: number;
  totalXp: number;
  avgLessonsPerUser: number;
  topLessons: { lessonId: string; title: string; completions: number }[];
  dailyCompletions: { date: string; count: number }[];
  learners: {
    email: string;
    xp: number;
    streak: number;
    lessonCount: number;
    lastActive: string | null;
  }[];
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function daysAgo(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().split("T")[0];
}

export async function fetchAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const supabase = createServiceClient();

  const [progressRes, attemptsRes, lessonsRes] = await Promise.all([
    supabase.from("user_progress").select("user_id, xp, streak_count, last_active_date"),
    supabase.from("lesson_attempts").select("lesson_id, completed_at, user_id"),
    supabase.from("lessons").select("id, title"),
  ]);

  if (progressRes.error) throw new Error(`user_progress: ${progressRes.error.message}`);
  if (attemptsRes.error) throw new Error(`lesson_attempts: ${attemptsRes.error.message}`);
  if (lessonsRes.error) throw new Error(`lessons: ${lessonsRes.error.message}`);

  const usersRes = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const emailByUserId = usersRes.error
    ? {}
    : Object.fromEntries(
        (usersRes.data.users ?? []).map((user) => [user.id, user.email ?? "unknown"])
      );

  const progress = progressRes.data ?? [];
  const attempts = attemptsRes.data ?? [];
  const lessonTitles = Object.fromEntries(
    (lessonsRes.data ?? []).map((lesson) => [lesson.id, lesson.title])
  );

  const today = getToday();
  const weekStart = daysAgo(6);

  const uniqueLessonsCompleted = new Set(attempts.map((attempt) => attempt.lesson_id)).size;
  const activeToday = progress.filter((row) => row.last_active_date === today).length;
  const activeLast7Days = progress.filter(
    (row) => row.last_active_date && row.last_active_date >= weekStart
  ).length;
  const totalXp = progress.reduce((sum, row) => sum + (row.xp ?? 0), 0);

  const lessonCounts = new Map<string, number>();
  for (const attempt of attempts) {
    lessonCounts.set(attempt.lesson_id, (lessonCounts.get(attempt.lesson_id) ?? 0) + 1);
  }

  const topLessons = [...lessonCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lessonId, completions]) => ({
      lessonId,
      title: lessonTitles[lessonId] ?? lessonId,
      completions,
    }));

  const dailyMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    dailyMap.set(daysAgo(i), 0);
  }
  for (const attempt of attempts) {
    const date = attempt.completed_at?.split("T")[0];
    if (date && dailyMap.has(date)) {
      dailyMap.set(date, (dailyMap.get(date) ?? 0) + 1);
    }
  }
  const dailyCompletions = [...dailyMap.entries()].map(([date, count]) => ({ date, count }));

  const attemptsByUser = new Map<string, number>();
  for (const attempt of attempts) {
    attemptsByUser.set(attempt.user_id, (attemptsByUser.get(attempt.user_id) ?? 0) + 1);
  }

  const learners = [...progress]
    .sort((a, b) => (b.last_active_date ?? "").localeCompare(a.last_active_date ?? ""))
    .slice(0, 15)
    .map((row) => ({
      email: emailByUserId[row.user_id] ?? `${row.user_id.slice(0, 8)}…`,
      xp: row.xp ?? 0,
      streak: row.streak_count ?? 0,
      lessonCount: attemptsByUser.get(row.user_id) ?? 0,
      lastActive: row.last_active_date,
    }));

  const totalUsers = progress.length;
  const avgLessonsPerUser =
    totalUsers > 0 ? Math.round((attempts.length / totalUsers) * 10) / 10 : 0;

  return {
    generatedAt: new Date().toISOString(),
    totalUsers,
    totalLessonAttempts: attempts.length,
    uniqueLessonsCompleted,
    activeToday,
    activeLast7Days,
    totalXp,
    avgLessonsPerUser,
    topLessons,
    dailyCompletions,
    learners,
  };
}
