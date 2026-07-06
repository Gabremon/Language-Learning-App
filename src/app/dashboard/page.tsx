import { DashboardView } from "@/components/dashboard/DashboardView";
import { DataLoadError } from "@/components/errors/DataLoadError";
import { AppShell } from "@/components/layout/AppShell";
import { loadCourseCatalog } from "@/lib/data/load-course";
import { getLessonVocabMap } from "@/lib/data/course";

export default async function DashboardPage() {
  const [result, lessonVocabMap] = await Promise.all([loadCourseCatalog(), getLessonVocabMap()]);
  if (!result.ok) {
    return (
      <AppShell>
        <DataLoadError message={result.message} />
      </AppShell>
    );
  }
  return <DashboardView catalog={result.data} lessonVocabMap={lessonVocabMap} />;
}
