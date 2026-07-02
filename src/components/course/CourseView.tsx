"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseCatalog } from "@/lib/course-utils";
import { getLessonsForUnit, isLessonUnlocked } from "@/lib/course-utils";
import { useProgress } from "@/contexts/ProgressContext";
import { Check, Lock, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { COURSE_SECTIONS, HSK_BAND_LABELS, getUnitsForSection } from "@/data/course-content";
import { useState } from "react";

interface Props {
  catalog: CourseCatalog;
}

export function CourseView({ catalog }: Props) {
  const { units, lessons } = catalog;
  const { progress, loading } = useProgress();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (loading || !progress) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AppShell>
    );
  }

  const toggleSection = (sectionId: string) => {
    setCollapsed((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Course Path</h1>
          <p className="text-gray-500">
            {catalog.course.title} — {units.length} units · {lessons.length} lessons
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Starter (20 lessons) → HSK 1 complete (274 words · ~{lessons.length - 20} lessons)
          </p>
        </div>

        {COURSE_SECTIONS.map((section) => {
          const sectionUnits = getUnitsForSection(section.id).map((def) =>
            units.find((u) => u.id === def.id)!
          ).filter(Boolean);
          const sectionLessons = sectionUnits.flatMap((u) => getLessonsForUnit(lessons, u.id));
          const sectionCompleted = sectionLessons.filter((l) =>
            progress.completedLessonIds.includes(l.id)
          ).length;
          const isCollapsed = collapsed[section.id];

          return (
            <section key={section.id} className="space-y-4">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-violet-50 px-5 py-4 text-left transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-brand-800">{section.title}</h2>
                    <Badge variant="muted">{sectionLessons.length} lessons</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{section.subtitle}</p>
                  <p className="text-xs text-brand-600 mt-0.5">{section.target}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-brand-700">
                    {sectionCompleted}/{sectionLessons.length}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="h-5 w-5 text-brand-500" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-brand-500" />
                  )}
                </div>
              </button>

              {!isCollapsed && (
                <div className="space-y-6 pl-2">
                  {sectionUnits.map((unit) => {
                    const unitLessons = getLessonsForUnit(lessons, unit.id);
                    const unitCompleted = unitLessons.filter((l) =>
                      progress.completedLessonIds.includes(l.id)
                    ).length;

                    return (
                      <Card key={unit.id} className="border-brand-100">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
                                {unit.orderIndex}
                              </span>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-xs text-brand-500">Unit {unit.orderIndex}</p>
                                  {HSK_BAND_LABELS[unit.id] && (
                                    <Badge variant="muted" className="text-xs">
                                      {HSK_BAND_LABELS[unit.id]}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-base">{unit.title}</p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-gray-500">
                              {unitCompleted}/{unitLessons.length}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {unitLessons.map((lesson) => {
                            const unlocked = isLessonUnlocked(
                              lesson.id,
                              progress.completedLessonIds,
                              units,
                              lessons
                            );
                            const completed = progress.completedLessonIds.includes(lesson.id);

                            return unlocked ? (
                              <Link
                                key={lesson.id}
                                href={`/lesson/${lesson.id}`}
                                className="flex items-center justify-between rounded-xl border border-brand-100 bg-white px-4 py-2.5 transition hover:border-brand-300 hover:shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={cn(
                                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                                      completed
                                        ? "bg-success text-white"
                                        : "bg-brand-100 text-brand-700"
                                    )}
                                  >
                                    {completed ? <Check className="h-4 w-4" /> : lesson.orderIndex}
                                  </span>
                                  <span className="text-sm font-medium">{lesson.title}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </Link>
                            ) : (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 opacity-60"
                              >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                                </span>
                                <span className="text-sm font-medium text-gray-500">{lesson.title}</span>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
