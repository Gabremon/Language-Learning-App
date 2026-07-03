import { AppShell } from "@/components/layout/AppShell";

export default function ProfileLoading() {
  return (
    <AppShell>
      <div className="animate-pulse space-y-4">
        <div className="mx-auto h-16 w-16 rounded-xl bg-stone-200" />
        <div className="mx-auto h-5 w-32 rounded bg-stone-200" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-stone-100" />
          ))}
        </div>
        <div className="h-24 rounded-2xl bg-stone-100" />
      </div>
    </AppShell>
  );
}
