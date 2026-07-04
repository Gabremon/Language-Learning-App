import { AppShell } from "@/components/layout/AppShell";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function DashboardLoading() {
  return (
    <AppShell variant="paper">
      <div role="status" aria-live="polite" aria-busy="true">
        <p className="sr-only">Loading your trail dashboard…</p>
        <DashboardSkeleton />
      </div>
    </AppShell>
  );
}
