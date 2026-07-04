import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  glyph?: string;
  variant?: "default" | "paper";
  className?: string;
}

export function PageLoadingShell({
  title,
  subtitle,
  glyph = "墨",
  variant = "default",
  className,
}: Props) {
  return (
    <AppShell variant={variant}>
      <div
        className={cn("flex min-h-[40vh] flex-col items-center justify-center gap-4", className)}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-xl font-bold text-brand-600">
          {glyph}
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-stone-700">{title}</p>
          {subtitle && <p className="text-xs text-stone-500">{subtitle}</p>}
        </div>
        <div className="flex w-48 animate-pulse flex-col gap-2">
          <div className="h-3 rounded-full bg-stone-100" />
          <div className="h-3 w-[80%] rounded-full bg-stone-100" />
        </div>
      </div>
    </AppShell>
  );
}
