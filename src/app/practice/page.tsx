import { redirect } from "next/navigation";

/** Guided practice is local-only for now — hidden until synced to Supabase. */
export default function PracticePage() {
  redirect("/dashboard");
}
