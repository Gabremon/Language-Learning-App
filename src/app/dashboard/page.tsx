import { DashboardView } from "@/components/dashboard/DashboardView";
import { getCourseCatalog } from "@/lib/data/course";

export default async function DashboardPage() {
  const catalog = await getCourseCatalog();
  return <DashboardView catalog={catalog} />;
}
