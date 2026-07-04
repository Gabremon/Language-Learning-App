/** First demo lesson — capped for a sub-5-minute first session. */
export const DEMO_LESSON_ID = "lesson-sa-1";

/** Max main-phase exercises in guest demo (research: 8–10 items). */
export const FIRST_SESSION_EXERCISE_CAP = 8;

export function isDemoLesson(lessonId: string): boolean {
  return lessonId === DEMO_LESSON_ID;
}

export function demoLessonPath(): string {
  return `/lesson/${DEMO_LESSON_ID}?mode=demo`;
}

export function isFirstSessionMode(lessonId: string, searchParams?: { mode?: string | null }): boolean {
  return isDemoLesson(lessonId) || searchParams?.mode === "demo";
}
