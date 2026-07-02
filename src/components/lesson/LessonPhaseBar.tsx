"use client";

import { PHASE_FOR_TYPE, getPhaseColor, getPhaseLabel } from "@/lib/lesson-generator";
import type { BaseExercise } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface Props {
  exercise: BaseExercise;
  className?: string;
}

export function LessonPhaseBar({ exercise, className }: Props) {
  const phase = PHASE_FOR_TYPE[exercise.type];
  const label = getPhaseLabel(phase);
  const gradient = getPhaseColor(phase);

  return (
    <div className={cn("overflow-hidden rounded-xl", className)}>
      <div className={cn("bg-gradient-to-r px-4 py-2 text-center text-sm font-semibold text-white", gradient)}>
        {label}
      </div>
    </div>
  );
}
