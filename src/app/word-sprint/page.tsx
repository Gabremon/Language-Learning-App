import { WordSprintView } from "@/components/word-sprint/WordSprintView";
import { getAllVocab, getCourseCatalog } from "@/lib/data/course";

export default async function WordSprintPage() {
  const [vocabItems, catalog] = await Promise.all([getAllVocab(), getCourseCatalog()]);

  return (
    <WordSprintView vocabItems={vocabItems} lessons={catalog.lessons} units={catalog.units} />
  );
}
