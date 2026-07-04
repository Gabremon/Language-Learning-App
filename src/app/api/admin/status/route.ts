import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Response.json({ isAdmin: isAdminEmail(user?.email) });
}
