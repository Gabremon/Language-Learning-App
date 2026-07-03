/** Primary gloss from a vocab entry's english field (before slash/alternatives). */
export function englishPrimary(english: string): string {
  return english.split("/")[0].split("(")[0].trim();
}

/** Auto-title from the first two vocab glosses, e.g. "hello · goodbye". */
export function buildVocabPreviewTitle(
  words: { english: string }[],
  fallback: string
): string {
  const labels = words
    .slice(0, 2)
    .map((w) => englishPrimary(w.english))
    .filter(Boolean);
  return labels.length > 0 ? labels.join(" · ") : fallback;
}

export type LessonTitleLocale = "en" | (string & {});

/**
 * Display title for a lesson. Defaults to English; extend here when adding
 * user locale or per-lesson title translations.
 */
export function getLessonDisplayTitle(
  lesson: { id: string; title: string },
  locale: LessonTitleLocale = "en"
): string {
  void locale;
  return lesson.title;
}

export function isReviewLesson(lesson: { id: string; title: string }): boolean {
  return (
    lesson.id.includes("-review") ||
    /review/i.test(lesson.title) ||
    /graduation exam/i.test(lesson.title)
  );
}
