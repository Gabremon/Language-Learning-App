import { WordSprintView } from "@/components/word-sprint/WordSprintView";
import { getAllVocab } from "@/lib/data/course";

export default async function WordSprintPage() {
  const vocab = await getAllVocab();
  return <WordSprintView vocabItems={vocab} />;
}
