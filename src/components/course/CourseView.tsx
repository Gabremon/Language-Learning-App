"use client";

import { AppShell } from "@/components/layout/AppShell";
import type { CourseCatalog } from "@/lib/course-utils";
import { getActiveUnit, getContinueLesson, getLessonsForUnit } from "@/lib/course-utils";
import { useProgress } from "@/contexts/ProgressContext";
import { COURSE_SECTIONS, getSectionIdForUnit, getUnitIdsForSection } from "@/data/course-sections";
import type { CourseSectionId } from "@/data/course-sections";
import { SectionScroll } from "@/components/course/ink-trail/SectionScroll";
import { UnitTrail } from "@/components/course/ink-trail/UnitTrail";
import { Button } from "@/components/ui/button";
import { InkPanel } from "@/components/ui/ink-shell";
import { APP_NAME } from "@/lib/brand";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  catalog: CourseCatalog;
}

export function CourseView({ catalog }: Props) {
  const { units, lessons } = catalog;
  const { progress, loading, error, retryLoad } = useProgress();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(COURSE_SECTIONS.map((section) => [section.id, true]))
  );
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(units.map((unit) => [unit.id, true]))
  );
  const pathExpandedInitialized = useRef(false);

  const completedIds = useMemo(
    () => progress?.completedLessonIds ?? [],
    [progress?.completedLessonIds]
  );
  const currentLessonId = useMemo(() => {
    if (!progress) return lessons[0]?.id ?? "";
    return getContinueLesson(
      lessons,
      units,
      progress.currentLessonId,
      progress.completedLessonIds
    ).id;
  }, [progress, lessons, units]);

  const activeUnitId = useMemo(
    () => getActiveUnit(units, lessons, completedIds).id,
    [units, lessons, completedIds]
  );

  const activeSectionId = useMemo(
    () => getSectionIdForUnit(activeUnitId, units),
    [activeUnitId, units]
  );

  useEffect(() => {
    if (loading || pathExpandedInitialized.current || !activeSectionId) return;
    pathExpandedInitialized.current = true;
    setCollapsedSections(
      Object.fromEntries(
        COURSE_SECTIONS.map((section) => [section.id, section.id !== activeSectionId])
      )
    );
    setCollapsedUnits(
      Object.fromEntries(units.map((unit) => [unit.id, unit.id !== activeUnitId]))
    );
  }, [loading, activeSectionId, activeUnitId, units]);

  return (
    <AppShell variant="paper">
      <div className="space-y-5">
        <header>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">{APP_NAME}</p>
          <h1 className="text-xl font-bold text-stone-800">Learning path</h1>
          <p className="text-sm text-stone-500">
            {units.length} seals · {lessons.length} steps
          </p>
        </header>

        {error && (
          <InkPanel className="border-amber-200 bg-amber-50/50 p-3">
            <p className="text-sm text-amber-900">
              Couldn&apos;t sync your progress. The trail is still visible — try again.
            </p>
            <p className="mt-1 text-xs text-amber-700">{error}</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => retryLoad()}>
              Retry sync
            </Button>
          </InkPanel>
        )}

        {loading && !progress && (
          <p className="text-center text-xs text-stone-400">Syncing progress…</p>
        )}

        {COURSE_SECTIONS.map((section) => {
          const sectionUnits = getUnitIdsForSection(section.id, units)
            .map((id) => units.find((u) => u.id === id)!)
            .filter(Boolean);
          const sectionLessons = sectionUnits.flatMap((u) => getLessonsForUnit(lessons, u.id));
          const sectionCompleted = sectionLessons.filter((l) => completedIds.includes(l.id)).length;
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
                      completedIds={completedIds}
                      currentLessonId={currentLessonId}
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
