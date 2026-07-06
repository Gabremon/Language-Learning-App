"use client";

import type { VocabMemory } from "@/lib/srs";
import {
  getMasteryLevelMessage,
  getMasteryProgress,
  getVocabMasteryLevel,
  MASTERY_LABELS,
  type VocabMasteryLevel,
} from "@/lib/srs";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<VocabMasteryLevel, { bar: string; badge: string }> = {
  new: { bar: "bg-stone-300", badge: "bg-stone-100 text-stone-600" },
  learning: { bar: "bg-amber-400", badge: "bg-amber-100 text-amber-800" },
  familiar: { bar: "bg-sky-400", badge: "bg-sky-100 text-sky-800" },
  experienced: { bar: "bg-violet-500", badge: "bg-violet-100 text-violet-800" },
  mastered: { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800" },
};

interface Props {
  memory: VocabMemory;
  previousLevel?: VocabMasteryLevel;
  compact?: boolean;
  className?: string;
}

export function VocabMasteryIndicator({
  memory,
  previousLevel,
  compact = false,
  className,
}: Props) {
  const level = getVocabMasteryLevel(memory);
  const progress = getMasteryProgress(memory);
  const styles = LEVEL_STYLES[level];
  const leveledUp = previousLevel !== undefined && previousLevel !== level;
  const message = leveledUp ? getMasteryLevelMessage(level) : null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Word mastery
        </p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            styles.badge
          )}
        >
          {MASTERY_LABELS[level]}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-100">
        <div
          className={cn("h-full rounded-full transition-all duration-500", styles.bar)}
          style={{ width: `${progress}%` }}
        />
      </div>
      {!compact && (
        <p className="text-xs text-stone-500">
          {level === "mastered"
            ? "Fully mastered — reviews spaced further apart."
            : `${progress}% toward mastered`}
        </p>
      )}
      {message && (
        <p className="text-xs font-semibold text-brand-700">{message}</p>
      )}
    </div>
  );
}
