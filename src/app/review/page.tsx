import { ReviewView } from "@/components/review/ReviewView";
import { getAllVocab, getCourseCatalog, getLessonVocabMap } from "@/lib/data/course";

export default async function ReviewPage() {
  const [vocabItems, catalog, lessonVocabMap] = await Promise.all([
    getAllVocab(),
    getCourseCatalog(),
    getLessonVocabMap(),
  ]);

  return (
    <ReviewView
      vocabItems={vocabItems}
      lessons={catalog.lessons}
      units={catalog.units}
      lessonVocabMap={lessonVocabMap}
    />
  );
}
