"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTION_STYLES } from "@/lib/unit-themes";
import type { CourseSectionId } from "@/data/starter-hsk1/units";

interface Props {
  sectionId: CourseSectionId;
  title: string;
  subtitle: string;
  completed: number;
  total: number;
  collapsed: boolean;
  onToggle: () => void;
}

export function SectionScroll({
  sectionId,
  title,
  subtitle,
  completed,
  total,
  collapsed,
  onToggle,
}: Props) {
  const style = SECTION_STYLES[sectionId];
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-3 text-left shadow-sm transition hover:shadow-md",
        style.border,
        style.paper
      )}
    >
      <div className="pointer-events-none absolute -right-3 -top-3 text-5xl font-bold opacity-[0.06]">
        {style.glyph}
      </div>
      <div className="relative flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-white/60 bg-white/80 text-xl font-bold shadow-sm"
          style={{ color: style.accent }}
        >
          {style.glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-800">{title}</h2>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-stone-600">
              {completed}/{total}
            </span>
          </div>
          <p className="truncate text-xs text-stone-600">{subtitle}</p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/60">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: style.accent }}
            />
          </div>
        </div>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-stone-500 transition-transform", collapsed && "-rotate-90")}
        />
      </div>
    </button>
  );
}
