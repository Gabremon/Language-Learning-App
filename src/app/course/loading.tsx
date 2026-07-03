import { AppShell } from "@/components/layout/AppShell";

export default function CourseLoading() {
  return (
    <AppShell variant="paper">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-40 rounded bg-stone-200" />
        <div className="h-4 w-56 rounded bg-stone-100" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-stone-100" />
        ))}
      </div>
    </AppShell>
  );
}
