import { LessonPlayer } from "@/components/lesson/LessonPlayer";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white px-4 py-6">
      <LessonPlayer lessonId={lessonId} />
    </div>
  );
}
