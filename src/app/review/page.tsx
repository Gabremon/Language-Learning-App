import { ReviewView } from "@/components/review/ReviewView";
import { getAllVocab, getLessonVocabMap } from "@/lib/data/course";

export default async function ReviewPage() {
  const [vocabItems, lessonVocabMap] = await Promise.all([getAllVocab(), getLessonVocabMap()]);
  return <ReviewView vocabItems={vocabItems} lessonVocabMap={lessonVocabMap} />;
}
