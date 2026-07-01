"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseCatalog } from "@/lib/course-utils";
import { getLessonsForUnit, isLessonUnlocked } from "@/lib/course-utils";
import { useProgress } from "@/contexts/ProgressContext";
import { Check, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  catalog: CourseCatalog;
}

export function CourseView({ catalog }: Props) {
  const { units, lessons } = catalog;
  const { progress, loading } = useProgress();

  if (loading || !progress) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Course Path</h1>
          <p className="text-gray-500">
            {catalog.course.title} — {units.length} units, {lessons.length} lessons
          </p>
        </div>

        <div className="relative space-y-8">
          {units.map((unit, unitIdx) => (
            <div key={unit.id} className="relative">
              {unitIdx < units.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-brand-200" />
              )}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-lg font-bold text-white">
                      {unit.orderIndex}
                    </span>
                    <div>
                      <p className="text-sm text-brand-500">Unit {unit.orderIndex}</p>
                      <p>{unit.title}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pl-4">
                  {getLessonsForUnit(lessons, unit.id).map((lesson, lessonIdx) => {
                    const unlocked = isLessonUnlocked(
                      lesson.id,
                      progress.completedLessonIds,
                      units,
                      lessons
                    );
                    const completed = progress.completedLessonIds.includes(lesson.id);
                    const unitLessons = getLessonsForUnit(lessons, unit.id);
                    return (
                      <div key={lesson.id} className="relative flex items-center gap-4">
                        <div
                          className={cn(
                            "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold",
                            completed && "border-success bg-success text-white",
                            unlocked && !completed && "border-brand-500 bg-white text-brand-600",
                            !unlocked && "border-gray-200 bg-gray-50 text-gray-400"
                          )}
                        >
                          {completed ? <Check className="h-5 w-5" /> : !unlocked ? <Lock className="h-4 w-4" /> : lesson.orderIndex}
                        </div>
                        {lessonIdx < unitLessons.length - 1 && (
                          <div className="absolute left-5 top-10 h-full w-0.5 bg-brand-100" />
                        )}
                        {unlocked ? (
                          <Link
                            href={`/lesson/${lesson.id}`}
                            className="flex flex-1 items-center justify-between rounded-xl border border-brand-100 bg-white px-4 py-3 transition hover:border-brand-300 hover:shadow-sm"
                          >
                            <span className="font-medium">{lesson.title}</span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </Link>
                        ) : (
                          <div className="flex flex-1 items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 opacity-60">
                            <span className="font-medium text-gray-500">{lesson.title}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
