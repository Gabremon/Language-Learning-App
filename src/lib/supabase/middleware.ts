import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_LESSON_ID } from "@/lib/demo";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/** Preserve session cookies when middleware returns a redirect. */
function redirectWithCookies(url: URL, supabaseResponse: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
    redirect.cookies.set(name, value);
  });
  return redirect;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === "/auth";
  const isAuthCallback = pathname === "/auth/callback";

  const protectedPrefixes = [
    "/dashboard",
    "/course",
    "/practice",
    "/review",
    "/vocabulary",
    "/profile",
    "/lesson",
    "/word-sprint",
  ];
  const isDemoLessonRoute = pathname === `/lesson/${DEMO_LESSON_ID}`;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!user && isProtected && !isDemoLessonRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", pathname);
    return redirectWithCookies(url, supabaseResponse);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.searchParams.get("next") || "/dashboard";
    url.searchParams.delete("next");
    return redirectWithCookies(url, supabaseResponse);
  }

  if (isAuthCallback) {
    return supabaseResponse;
  }

  return supabaseResponse;
}
