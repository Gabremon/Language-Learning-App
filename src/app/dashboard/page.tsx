import { DashboardView } from "@/components/dashboard/DashboardView";
import { DataLoadError } from "@/components/errors/DataLoadError";
import { AppShell } from "@/components/layout/AppShell";
import { loadCourseCatalog } from "@/lib/data/load-course";

export default async function DashboardPage() {
  const result = await loadCourseCatalog();
  if (!result.ok) {
    return (
      <AppShell>
        <DataLoadError message={result.message} />
      </AppShell>
    );
  }
  return <DashboardView catalog={result.data} />;
}
