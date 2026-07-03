import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthProgressPrompt } from "@/components/errors/AuthProgressPrompt";
import { InkPanel } from "@/components/ui/ink-shell";

interface Props {
  title?: string;
  message: string;
}

export function DataLoadError({
  title = "Could not load data",
  message,
}: Props) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-4">
      <InkPanel className="max-w-md p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-red-200 bg-red-50 text-lg font-bold text-red-600">
          !
        </div>
        <h2 className="text-lg font-bold text-stone-800">{title}</h2>
        <p className="mt-2 text-sm text-stone-600">{message}</p>
        <p className="mt-2 text-xs text-stone-500">
          Check your Supabase connection and that course migrations have been applied.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button variant="secondary" size="sm">
            Back to dashboard
          </Button>
        </Link>
      </InkPanel>

      <AuthProgressPrompt
        compact
        title="Keep learning anyway"
        message="The course data isn't available right now, but you can still try the demo lesson."
      />
    </div>
  );
}
