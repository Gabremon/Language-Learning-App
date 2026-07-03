"use client";

import type { Lesson, Unit } from "@/types/course";
import { getLessonsForUnit, isLessonUnlocked } from "@/lib/course-utils";
import { getTrailSide, getUnitTheme } from "@/lib/unit-themes";
import { LessonTile, type LessonTileState } from "./LessonTile";
import { UnitSeal } from "./UnitSeal";

interface Props {
  unit: Unit;
  lessons: Lesson[];
  allUnits: Unit[];
  completedIds: string[];
  currentLessonId: string;
  isActive: boolean;
  expanded: boolean;
  onToggle: () => void;
}

function getLessonState(
  lesson: Lesson,
  unlocked: boolean,
  completed: boolean,
  isCurrent: boolean
): LessonTileState {
  if (!unlocked) return "locked";
  if (completed) return "completed";
  if (isCurrent) return "current";
  return "available";
}

export function UnitTrail({
  unit,
  lessons,
  allUnits,
  completedIds,
  currentLessonId,
  isActive,
  expanded,
  onToggle,
}: Props) {
  const theme = getUnitTheme(unit.orderIndex, unit.id);
  const unitLessons = getLessonsForUnit(lessons, unit.id);
  const unitCompleted = unitLessons.filter((l) => completedIds.includes(l.id)).length;

  return (
    <div className="space-y-2">
      <UnitSeal
        orderIndex={unit.orderIndex}
        title={unit.title}
        completed={unitCompleted}
        total={unitLessons.length}
        theme={theme}
        isActive={isActive}
        expanded={expanded}
        onToggle={onToggle}
      />

      {expanded && (
        <div
          className="relative rounded-xl border border-stone-200/50 px-2 py-3"
          style={{ background: `linear-gradient(180deg, ${theme.light}55, transparent 70%)` }}
        >
          <div
            className="pointer-events-none absolute bottom-4 left-1/2 top-4 w-0.5 -translate-x-1/2 rounded-full opacity-30"
            style={{ background: `linear-gradient(180deg, transparent, ${theme.stroke}, transparent)` }}
          />
          {unitLessons.map((lesson, index) => {
            const unlocked = isLessonUnlocked(lesson.id, completedIds, allUnits, lessons);
            const completed = completedIds.includes(lesson.id);
            const isCurrent = lesson.id === currentLessonId;
            const state = getLessonState(lesson, unlocked, completed, isCurrent);
            const prevCompleted =
              index === 0 || completedIds.includes(unitLessons[index - 1].id);

            return (
              <LessonTile
                key={lesson.id}
                title={lesson.title}
                orderIndex={lesson.orderIndex}
                state={state}
                theme={theme}
                side={getTrailSide(index)}
                href={unlocked ? `/lesson/${lesson.id}` : undefined}
                isReview={lesson.title.toLowerCase().includes("review")}
                showConnector={index > 0}
                connectorFilled={prevCompleted && (completed || unlocked)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
