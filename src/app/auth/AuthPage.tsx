"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const error = searchParams.get("error");

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

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              Sign in failed. Please try again.
            </p>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600">
            Back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
