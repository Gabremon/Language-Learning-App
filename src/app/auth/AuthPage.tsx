"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/marketing/GoogleSignInButton";
import {
  BrandMark,
  MARKETING_STATS,
  MarketingNav,
} from "@/components/marketing/MarketingShell";
import { APP_MARK, APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { demoLessonPath } from "@/lib/demo";
import { CheckCircle2 } from "lucide-react";

function getErrorMessage(error: string | null, description: string | null): string | null {
  if (!error) return null;

  if (description?.includes("Unable to exchange external code")) {
    return "Google credentials are wrong or missing in Supabase. Open Supabase Dashboard → Authentication → Providers → Google, and paste your Google Client ID and Client Secret (from Google Cloud Console). The app does not read Google keys from .env.";
  }

  if (error === "missing_code") {
    return "No authorization code returned. Check that Supabase Redirect URLs include your app URL (e.g. http://localhost:3001/auth/callback).";
  }

  if (description) return description;

  return "Sign in failed. Please try again.";
}

const SIGN_IN_BENEFITS = [
  "Save progress across devices",
  "Track streaks, XP, and review schedule",
  "Pick up lessons right where you left off",
];

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const errorMessage = getErrorMessage(error, errorDescription) ?? signInError;

  useEffect(() => {
    const supabase = createClient();
    let settled = false;

    function finishChecking() {
      if (!settled) {
        settled = true;
        setChecking(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const next = searchParams.get("next") || "/dashboard";
        window.location.href = next;
        return;
      }
      if (event === "INITIAL_SESSION" || event === "SIGNED_OUT") {
        finishChecking();
      }
    });

    const timeout = window.setTimeout(finishChecking, 4000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [searchParams]);

  async function signInWithGoogle() {
    setLoading(true);
    const supabase = createClient();
    const next = searchParams.get("next") || "/dashboard";
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (signInError) {
      setLoading(false);
      setSignInError(signInError.message);
      console.error(signInError);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-200 bg-white text-xl font-bold text-brand-700 shadow-sm">
            {APP_MARK}
          </div>
          <p className="text-sm text-stone-500">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <MarketingNav />

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <div className="relative hidden overflow-hidden rounded-3xl border border-brand-200/50 bg-gradient-to-br from-brand-500 via-brand-600 to-violet-700 p-10 text-white shadow-xl lg:block">
          <div className="pointer-events-none absolute -right-4 -top-6 text-[8rem] font-bold opacity-10">
            {APP_MARK}
          </div>
          <BrandMark size="md" />
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-100/90">
            {APP_TAGLINE}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight">
            Your Mandarin journey, saved and synced
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-brand-50/90">
            Sign in once to unlock your course path, spaced review, and progress across every
            device.
          </p>

          <ul className="mt-8 space-y-3">
            {SIGN_IN_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm text-brand-50">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-300" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex gap-8 border-t border-white/15 pt-8">
            {MARKETING_STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-extrabold">{value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-brand-100/80">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-slide-up mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-stone-200/80 bg-white/95 p-8 shadow-xl backdrop-blur sm:p-10">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-2xl font-bold text-brand-700 shadow-sm lg:mx-0">
                {APP_MARK}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                {APP_NAME}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-stone-800">Sign in to continue</h2>
              <p className="mt-2 text-sm text-stone-500">
                Free to start. One click with your Google account.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
                <p className="font-semibold">Sign in failed</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <GoogleSignInButton loading={loading} onClick={signInWithGoogle} />

            <Link
              href={demoLessonPath()}
              className="mt-4 block text-center text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              Try demo lesson first — no sign-in needed
            </Link>

            <p className="mt-4 text-center text-xs leading-relaxed text-stone-400">
              We only use your account to save learning progress. No spam, no upsells.
            </p>

            {process.env.NODE_ENV === "development" && (
              <p className="mt-4 rounded-lg bg-stone-50 px-3 py-2 text-left text-[11px] leading-relaxed text-stone-400">
                Dev: add{" "}
                <code className="rounded bg-stone-100 px-1 text-stone-600">
                  {typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}
                  /auth/callback
                </code>{" "}
                to Supabase redirect URLs.
              </p>
            )}

            <Link
              href="/"
              className="mt-6 block text-center text-sm font-medium text-stone-400 transition hover:text-brand-600"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
