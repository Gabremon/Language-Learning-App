import { PageLoadingShell } from "@/components/ui/PageLoadingShell";

export default function VocabularyLoading() {
  return (
    <PageLoadingShell
      glyph="词"
      title="Loading your word scroll…"
      subtitle="Gathering vocabulary from the trail"
    />
  );
}
