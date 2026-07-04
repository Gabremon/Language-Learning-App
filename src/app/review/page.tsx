import { ReviewView } from "@/components/review/ReviewView";
import { getAllVocab, getCourseCatalog } from "@/lib/data/course";

export default async function ReviewPage() {
  const [vocabItems, catalog] = await Promise.all([getAllVocab(), getCourseCatalog()]);

  return (
    <ReviewView vocabItems={vocabItems} lessons={catalog.lessons} units={catalog.units} />
  );
}
