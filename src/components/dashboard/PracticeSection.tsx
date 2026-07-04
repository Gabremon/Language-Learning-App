"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, RotateCcw, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WORD_SPRINT_PATH } from "@/lib/word-sprint";
import { cn } from "@/lib/utils";

type PracticeFlair = "violet" | "amber";

const FLAIR_STYLES: Record<
  PracticeFlair,
  {
    ring: string;
    glyph: string;
    chevron: string;
    button: string;
    badge: string;
  }
> = {
  violet: {
    ring: "ring-violet-100",
    glyph: "border-violet-200/80 bg-violet-50 text-violet-700",
    chevron: "text-violet-500",
    button: "border-violet-200/70 bg-violet-50 text-violet-800 hover:bg-violet-100",
    badge: "text-violet-700",
  },
  amber: {
    ring: "ring-amber-100",
    glyph: "border-amber-200/80 bg-amber-50 text-amber-700",
    chevron: "text-amber-500",
    button: "border-amber-200/70 bg-amber-50 text-amber-800 hover:bg-amber-100",
    badge: "text-amber-700",
  },
};

interface PracticeModeCardProps {
  href: string;
  glyph: string;
  flair: PracticeFlair;
  label: string;
  labelIcon?: LucideIcon;
  title: string;
  subtitle: string;
}

function PracticeModeCard({
  href,
  glyph,
  flair,
  label,
  labelIcon: LabelIcon,
  title,
  subtitle,
}: PracticeModeCardProps) {
  const styles = FLAIR_STYLES[flair];

  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "border-0 bg-white/90 shadow-sm ring-1 transition hover:shadow-md",
          styles.ring
        )}
      >
        <CardContent className="flex items-center justify-between gap-3 p-3.5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-base font-bold",
                styles.glyph
              )}
            >
              {glyph}
            </div>
            <div className="min-w-0">
              <Badge
                variant="muted"
                className={cn("mb-1 gap-1 px-1.5 py-0 text-[10px]", styles.badge)}
              >
                {LabelIcon && <LabelIcon className="h-2.5 w-2.5" />}
                {label}
              </Badge>
              <p className="truncate text-sm font-bold text-stone-800">{title}</p>
              <p className="text-[10px] text-stone-500">{subtitle}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className={cn(
              "pointer-events-none h-9 shrink-0 px-3 text-xs shadow-none",
              styles.button
            )}
            tabIndex={-1}
          >
            Go <ChevronRight className={cn("h-4 w-4", styles.chevron)} />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

interface Props {
  dueReviews: number;
  practiceWords?: number;
  sprintBestScore?: number;
}

export function PracticeSection({ dueReviews, practiceWords = 0, sprintBestScore = 0 }: Props) {
  const reviewSubtitle =
    dueReviews > 0
      ? `${dueReviews} word${dueReviews === 1 ? "" : "s"} due in your queue`
      : practiceWords > 0
        ? `${practiceWords} word${practiceWords === 1 ? "" : "s"} from your lessons`
        : "Complete a lesson to unlock practice words";

  const sprintSubtitle =
    sprintBestScore > 0
      ? `Personal best: ${sprintBestScore} words · learned vocab only`
      : "30 seconds · learned vocab only";

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Practice</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <PracticeModeCard
          href="/review"
          glyph="复"
          flair="violet"
          label="Spaced review"
          labelIcon={RotateCcw}
          title={
            dueReviews > 0
              ? `Review ${dueReviews} words`
              : practiceWords > 0
                ? `Practice ${practiceWords} words`
                : "Word recall"
          }
          subtitle={reviewSubtitle}
        />
        <PracticeModeCard
          href={WORD_SPRINT_PATH}
          glyph="速"
          flair="amber"
          label="Word sprint"
          labelIcon={Timer}
          title="30-second hanzi build"
          subtitle={sprintSubtitle}
        />
      </div>
    </div>
  );
}
