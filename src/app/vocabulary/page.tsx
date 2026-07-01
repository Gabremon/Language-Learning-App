import { VocabularyView } from "@/components/vocabulary/VocabularyView";
import { getAllVocab } from "@/lib/data/course";

export default async function VocabularyPage() {
  const vocab = await getAllVocab();
  return <VocabularyView vocab={vocab} />;
}
