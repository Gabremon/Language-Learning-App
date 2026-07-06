import { getAdminUser } from "@/lib/admin-auth";
import { fetchAnalyticsSnapshot } from "@/lib/data/analytics";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const snapshot = await fetchAnalyticsSnapshot();
    return Response.json(snapshot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load analytics";
    return Response.json({ error: message }, { status: 500 });
  }
}
