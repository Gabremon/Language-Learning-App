"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const errorMessage = getErrorMessage(error, errorDescription);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const next = searchParams.get("next") || "/dashboard";
        window.location.href = next;
        return;
      }
      setChecking(false);
    });
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
      console.error(signInError);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-500 via-brand-400 to-brand-600 px-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="space-y-6 pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl font-bold text-brand-700">
            汉
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-800">Welcome to Hanzi Path</h1>
            <p className="mt-2 text-gray-500">Sign in to save your progress across devices</p>
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-left text-sm text-red-700">
              <p className="font-medium">Sign in failed</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <p className="text-xs text-gray-400">
            Using {typeof window !== "undefined" ? window.location.origin : "this app"} — add{" "}
            <code className="rounded bg-gray-100 px-1">
              {typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}
              /auth/callback
            </code>{" "}
            to Supabase → Authentication → URL Configuration → Redirect URLs.
          </p>

          <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600">
            Back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
