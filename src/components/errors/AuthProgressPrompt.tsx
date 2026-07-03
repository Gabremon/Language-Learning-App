import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InkPanel } from "@/components/ui/ink-shell";
import { demoLessonPath } from "@/lib/demo";
import { cn } from "@/lib/utils";
import { ArrowRight, Play } from "lucide-react";

interface Props {
  title?: string;
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  compact?: boolean;
}

export function AuthProgressPrompt({
  title = "Sign in to save progress",
  message = "Try a free demo lesson first, or sign in with Google to sync XP, streaks, and review.",
  error,
  onRetry,
  compact = false,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        compact ? "py-6" : "min-h-[50vh] p-4"
      )}
    >
      <InkPanel className={cn("text-center", compact ? "max-w-sm p-4" : "max-w-md p-6")}>
        <h2 className="text-lg font-bold text-stone-800">{title}</h2>
        <p className="mt-2 text-sm text-stone-600">{message}</p>
        {error && <p className="mt-2 text-xs text-amber-700">{error}</p>}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href={demoLessonPath()} className="sm:flex-1">
            <Button size="lg" className="w-full gap-2">
              <Play className="h-4 w-4" />
              Try demo lesson
            </Button>
          </Link>
          <Link href="/auth" className="sm:flex-1">
            <Button size="lg" variant="secondary" className="w-full gap-2">
              Sign in to save progress
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-xs font-semibold text-brand-600 hover:underline"
          >
            Retry loading progress
          </button>
        )}
      </InkPanel>
    </div>
  );
}
