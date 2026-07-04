import { Suspense } from "react";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { DataLoadError } from "@/components/errors/DataLoadError";
import { getCourseCatalog } from "@/lib/data/course";
import { loadLessonBundle } from "@/lib/data/load-lesson";
import { getNextLesson } from "@/lib/course-utils";
import { isDemoLesson } from "@/lib/demo";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;

  let bundle;
  try {
    bundle = await loadLessonBundle(lessonId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load lesson";
    return (
      <div className="min-h-screen bg-paper px-3 py-4 sm:px-4">
        <DataLoadError message={message} />
      </div>
    );
  }

  let nextLesson = null;
  try {
    const catalog = await getCourseCatalog();
    nextLesson = getNextLesson(catalog.lessons, lessonId, catalog.units);
  } catch {
    // next lesson is optional on the completion screen
  }

  return (
    <div className="min-h-screen bg-paper px-3 py-4 sm:px-4">
      <Suspense fallback={<div className="py-12 text-center text-sm text-stone-500">Loading lesson…</div>}>
        <LessonPlayer
          lesson={bundle.lesson}
          exercises={bundle.exercises}
          lessonVocab={bundle.vocab}
          nextLesson={nextLesson}
          allowGuest={isDemoLesson(lessonId)}
        />
      </Suspense>
    </div>
  );
}
