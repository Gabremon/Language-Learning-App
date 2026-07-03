"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UnitTheme } from "@/lib/unit-themes";

interface Props {
  orderIndex: number;
  title: string;
  completed: number;
  total: number;
  theme: UnitTheme;
  isActive?: boolean;
  expanded?: boolean;
  onToggle: () => void;
}

export function UnitSeal({
  orderIndex,
  title,
  completed,
  total,
  theme,
  isActive,
  expanded,
  onToggle,
}: Props) {
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
        isActive ? "border-opacity-60 shadow-sm" : "border-stone-200/80 bg-white/70 hover:bg-white"
      )}
      style={
        isActive
          ? {
              borderColor: `${theme.stroke}66`,
              background: `linear-gradient(135deg, ${theme.light}ee, white)`,
            }
          : undefined
      }
    >
      <div
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 bg-white shadow-sm"
        style={{ borderColor: theme.stroke, color: theme.to }}
      >
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold shadow ring-1 ring-stone-200">
          {orderIndex}
        </span>
        <span className="text-base font-bold">{theme.glyph}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-stone-800">{title}</p>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-200/80">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${theme.from}, ${theme.to})` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-stone-500">
            {completed}/{total}
          </span>
        </div>
      </div>

      <ChevronDown
        className={cn("h-4 w-4 shrink-0 text-stone-400 transition-transform", expanded && "rotate-180")}
      />
    </button>
  );
}
