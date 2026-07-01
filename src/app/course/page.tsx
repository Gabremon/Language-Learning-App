import { CourseView } from "@/components/course/CourseView";
import { getCourseCatalog } from "@/lib/data/course";

export default async function CoursePage() {
  const catalog = await getCourseCatalog();
  return <CourseView catalog={catalog} />;
}
