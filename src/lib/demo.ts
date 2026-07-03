/** First lesson — playable without signing in. */
export const DEMO_LESSON_ID = "lesson-sa-1";

export function isDemoLesson(lessonId: string): boolean {
  return lessonId === DEMO_LESSON_ID;
}

export function demoLessonPath(): string {
  return `/lesson/${DEMO_LESSON_ID}`;
}
