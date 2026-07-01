import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");

  if (oauthError) {
    const params = new URLSearchParams({
      error: oauthError,
      error_description:
        oauthErrorDescription ??
        "Supabase could not complete Google sign-in. Check Google Client ID and Secret in Supabase Dashboard → Authentication → Providers → Google.",
    });
    return NextResponse.redirect(`${origin}/auth?${params.toString()}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=missing_code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const params = new URLSearchParams({
      error: "exchange_failed",
      error_description: error.message,
    });
    return NextResponse.redirect(`${origin}/auth?${params.toString()}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
