import { ReviewView } from "@/components/review/ReviewView";
import { getAllVocab } from "@/lib/data/course";

export default async function ReviewPage() {
  const vocabItems = await getAllVocab();
  return <ReviewView vocabItems={vocabItems} />;
}
