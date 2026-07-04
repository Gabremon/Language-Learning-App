import { PageLoadingShell } from "@/components/ui/PageLoadingShell";

export default function ReviewLoading() {
  return (
    <PageLoadingShell
      glyph="复"
      title="Checking what words are due…"
      subtitle="Loading your spaced review queue"
    />
  );
}
