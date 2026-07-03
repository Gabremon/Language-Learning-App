"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson, Unit } from "@/types/course";
import { getLessonDisplayTitle } from "@/lib/lesson-titles";
import { getUnitTheme } from "@/lib/unit-themes";
import { InkConnectorHorizontal } from "./InkConnector";

interface MiniLesson {
  lesson: Lesson;
  unlocked: boolean;
  completed: boolean;
  isCurrent: boolean;
}

interface Props {
  unit: Unit;
  items: MiniLesson[];
  remainingCount: number;
}

export function MiniTrail({ unit, items, remainingCount }: Props) {
  const theme = getUnitTheme(unit.orderIndex, unit.id);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-stone-200/70 p-3"
      style={{ background: `linear-gradient(135deg, ${theme.light}cc, white)` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg border-2 bg-white text-sm font-bold"
          style={{ borderColor: theme.stroke, color: theme.to }}
        >
          {theme.glyph}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-stone-800">
            Unit {unit.orderIndex}: {unit.title}
          </p>
          <p className="text-[10px] text-stone-500">Your ink trail continues here</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-xs text-stone-500">Unit complete — onward!</p>
      ) : (
        <div className="flex items-center justify-center gap-0.5 overflow-x-auto pb-1">
          {items.map(({ lesson, unlocked, completed, isCurrent }, index) => (
            <div key={lesson.id} className="flex items-center">
              {index > 0 && (
                <InkConnectorHorizontal
                  filled={items[index - 1].completed}
                  color={items[index - 1].completed ? theme.stroke : "#D6D3D1"}
                />
              )}
              {unlocked ? (
                <Link
                  href={`/lesson/${lesson.id}`}
                  title={getLessonDisplayTitle(lesson)}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.6rem] text-xs font-bold text-white transition hover:scale-105",
                    completed && "bg-emerald-500",
                    !completed && "ink-trail-shadow",
                    isCurrent && "animate-ink-pulse ring-2 ring-white ring-offset-1"
                  )}
                  style={
                    !completed
                      ? { background: `linear-gradient(145deg, ${theme.from}, ${theme.to})` }
                      : undefined
                  }
                >
                  {completed ? "✓" : lesson.orderIndex}
                </Link>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.6rem] bg-stone-200 text-stone-400">
                  <Lock className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {remainingCount > 0 && (
        <Link
          href="/course"
          className="mt-2 block text-center text-xs font-semibold transition hover:underline"
          style={{ color: theme.to }}
        >
          +{remainingCount} more steps on the trail →
        </Link>
      )}
    </div>
  );
}
