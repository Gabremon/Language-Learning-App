import { PageLoadingShell } from "@/components/ui/PageLoadingShell";

export default function AuthLoading() {
  return (
    <PageLoadingShell
      glyph="入"
      title="Checking your session…"
      subtitle="Sign in to sync your progress across devices"
      variant="paper"
      className="min-h-screen"
    />
  );
}
