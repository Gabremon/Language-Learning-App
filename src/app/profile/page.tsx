import { ProfileView } from "@/components/profile/ProfileView";
import { getCourseCatalog } from "@/lib/data/course";

export default async function ProfilePage() {
  const catalog = await getCourseCatalog();
  return <ProfileView catalog={catalog} />;
}
