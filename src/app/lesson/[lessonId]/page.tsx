import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { getCourseCatalog, getLessonBundle } from "@/lib/data/course";
import { getNextLesson } from "@/lib/course-utils";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const [bundle, catalog] = await Promise.all([
    getLessonBundle(lessonId),
    getCourseCatalog(),
  ]);

  const nextLesson = getNextLesson(catalog.lessons, lessonId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white px-4 py-6">
      <LessonPlayer
        lesson={bundle.lesson}
        exercises={bundle.exercises}
        lessonVocab={bundle.vocab}
        nextLesson={nextLesson}
      />
    </div>
  );
}
