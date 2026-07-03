"use client";

import { AppShell } from "@/components/layout/AppShell";
import type { CourseCatalog } from "@/lib/course-utils";
import { getActiveUnit } from "@/lib/course-utils";
import { getLessonsForUnit } from "@/lib/course-utils";
import { useProgress } from "@/contexts/ProgressContext";
import { COURSE_SECTIONS, getUnitsForSection } from "@/data/course-content";
import type { CourseSectionId } from "@/data/starter-hsk1/units";
import { SectionScroll } from "@/components/course/ink-trail/SectionScroll";
import { UnitTrail } from "@/components/course/ink-trail/UnitTrail";
import { useEffect, useMemo, useState } from "react";

interface Props {
  catalog: CourseCatalog;
}

export function CourseView({ catalog }: Props) {
  const { units, lessons } = catalog;
  const { progress, loading } = useProgress();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    hsk1: true,
  });
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  const activeUnitId = useMemo(
    () =>
      progress
        ? getActiveUnit(units, lessons, progress.completedLessonIds).id
        : units[0]?.id,
    [progress, units, lessons]
  );

  useEffect(() => {
    if (!progress) return;
    setCollapsedUnits((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      return Object.fromEntries(units.map((unit) => [unit.id, unit.id !== activeUnitId]));
    });
  }, [progress, units, activeUnitId]);

  if (loading || !progress) {
    return (
      <AppShell variant="paper">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-stone-500">Loading your trail...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell variant="paper">
      <div className="space-y-5">
        <header>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">墨径 · Ink Trail</p>
          <h1 className="text-xl font-bold text-stone-800">Learning path</h1>
          <p className="text-sm text-stone-500">
            {units.length} seals · {lessons.length} steps
          </p>
        </header>

        {COURSE_SECTIONS.map((section) => {
          const sectionUnits = getUnitsForSection(section.id)
            .map((def) => units.find((u) => u.id === def.id)!)
            .filter(Boolean);
          const sectionLessons = sectionUnits.flatMap((u) => getLessonsForUnit(lessons, u.id));
          const sectionCompleted = sectionLessons.filter((l) =>
            progress.completedLessonIds.includes(l.id)
          ).length;
          const sectionCollapsed = collapsedSections[section.id];

          return (
            <section key={section.id} className="space-y-3">
              <SectionScroll
                sectionId={section.id as CourseSectionId}
                title={section.title}
                subtitle={section.subtitle}
                completed={sectionCompleted}
                total={sectionLessons.length}
                collapsed={!!sectionCollapsed}
                onToggle={() =>
                  setCollapsedSections((prev) => ({
                    ...prev,
                    [section.id]: !prev[section.id],
                  }))
                }
              />

              {!sectionCollapsed && (
                <div className="space-y-3 pl-1">
                  {sectionUnits.map((unit) => (
                    <UnitTrail
                      key={unit.id}
                      unit={unit}
                      lessons={lessons}
                      allUnits={units}
                      completedIds={progress.completedLessonIds}
                      currentLessonId={progress.currentLessonId ?? lessons[0]?.id ?? ""}
                      isActive={unit.id === activeUnitId}
                      expanded={!collapsedUnits[unit.id]}
                      onToggle={() =>
                        setCollapsedUnits((prev) => ({
                          ...prev,
                          [unit.id]: !prev[unit.id],
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <p className="text-center text-[10px] text-stone-400">
          Tap a seal to unfold each unit&apos;s trail
        </p>
      </div>
    </AppShell>
  );
}
