"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InkPanel } from "@/components/ui/ink-shell";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-4">
      <InkPanel className="max-w-md p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-amber-300 bg-amber-50 text-xl font-bold text-amber-700">
          障
        </div>
        <h1 className="text-lg font-bold text-stone-800">Something went wrong</h1>
        <p className="mt-2 text-sm text-stone-600">
          The page failed to load. This often happens when the dev server cache gets stuck after a
          code change.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="secondary" onClick={() => window.location.assign("/dashboard")}>
            Back to trail
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && error.message && (
          <p className="mt-4 break-all text-left text-[10px] text-stone-400">{error.message}</p>
        )}
      </InkPanel>
    </div>
  );
}
