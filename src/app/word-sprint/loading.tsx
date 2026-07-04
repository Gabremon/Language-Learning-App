import { PageLoadingShell } from "@/components/ui/PageLoadingShell";

export default function WordSprintLoading() {
  return (
    <PageLoadingShell
      glyph="速"
      title="Loading word sprint…"
      subtitle="Gathering words you've already learned"
    />
  );
}
