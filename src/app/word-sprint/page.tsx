import { WordSprintView } from "@/components/word-sprint/WordSprintView";
import { getAllVocab, getCourseCatalog, getLessonVocabMap } from "@/lib/data/course";

export default async function WordSprintPage() {
  const [vocabItems, catalog, lessonVocabMap] = await Promise.all([
    getAllVocab(),
    getCourseCatalog(),
    getLessonVocabMap(),
  ]);

  return (
    <WordSprintView
      vocabItems={vocabItems}
      lessons={catalog.lessons}
      units={catalog.units}
      lessonVocabMap={lessonVocabMap}
    />
  );
}
