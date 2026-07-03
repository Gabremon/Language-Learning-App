import { CourseView } from "@/components/course/CourseView";
import { DataLoadError } from "@/components/errors/DataLoadError";
import { AppShell } from "@/components/layout/AppShell";
import { loadCourseCatalog } from "@/lib/data/load-course";

export default async function CoursePage() {
  const result = await loadCourseCatalog();
  if (!result.ok) {
    return (
      <AppShell>
        <DataLoadError message={result.message} />
      </AppShell>
    );
  }
  return <CourseView catalog={result.data} />;
}
