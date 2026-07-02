"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CourseCatalog } from "@/lib/course-utils";
import { getLessonsForUnit, isLessonUnlocked } from "@/lib/course-utils";
import { getDueReviewCount } from "@/lib/srs";
import { useProgress } from "@/contexts/ProgressContext";
import { Flame, Star, RotateCcw, ChevronRight, Lock, BookOpen, Sparkles } from "lucide-react";
import { COURSE_SECTIONS, getUnitsForSection } from "@/data/course-content";
import { cn } from "@/lib/utils";

const UNIT_THEMES = [
  { gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", border: "border-violet-200", icon: "🔤" },
  { gradient: "from-pink-500 to-rose-600", bg: "bg-pink-50", border: "border-pink-200", icon: "🔢" },
  { gradient: "from-sky-500 to-blue-600", bg: "bg-sky-50", border: "border-sky-200", icon: "👨‍👩‍👧" },
  { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: "⏰" },
  { gradient: "from-orange-500 to-amber-600", bg: "bg-orange-50", border: "border-orange-200", icon: "🍜" },
  { gradient: "from-indigo-500 to-violet-600", bg: "bg-indigo-50", border: "border-indigo-200", icon: "🛒" },
];

interface Props {
  catalog: CourseCatalog;
}

export function DashboardView({ catalog }: Props) {
  const { course, units, lessons } = catalog;
  const { progress, loading, getAllMemories } = useProgress();

  if (loading || !progress) {
    return (
      <AppShell>
        <DashboardSkeleton />
      </AppShell>
    );
  }

  const dueReviews = getDueReviewCount(getAllMemories());
  const currentLesson = lessons.find((l) => l.id === progress.currentLessonId) ?? lessons[0];
  const completedCount = progress.completedLessonIds.length;
  const totalLessons = lessons.length;

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-violet-600 p-6 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 text-8xl opacity-10">汉</div>
          <div className="relative flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur">
              汉
            </div>
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-brand-100">
                {completedCount}/{totalLessons} lessons complete
              </p>
            </div>
          </div>
          <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${(completedCount / totalLessons) * 100}%` }}
            />
          </div>
        </header>

        <div className="grid grid-cols-3 gap-3">
          <Card className="overflow-hidden border-0 shadow-md ring-1 ring-amber-100">
            <CardContent className="flex flex-col items-center gap-1 bg-gradient-to-b from-amber-50 to-white p-4 text-center">
              <Star className="h-7 w-7 text-amber-500" />
              <p className="text-2xl font-bold text-brand-800">{progress.xp}</p>
              <p className="text-xs font-semibold text-gray-500">XP</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-0 shadow-md ring-1 ring-orange-100">
            <CardContent className="flex flex-col items-center gap-1 bg-gradient-to-b from-orange-50 to-white p-4 text-center">
              <Flame className="h-7 w-7 text-orange-500" />
              <p className="text-2xl font-bold text-brand-800">{progress.streakCount}</p>
              <p className="text-xs font-semibold text-gray-500">Day streak</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-0 shadow-md ring-1 ring-violet-100">
            <CardContent className="flex flex-col items-center gap-1 bg-gradient-to-b from-violet-50 to-white p-4 text-center">
              <RotateCcw className="h-7 w-7 text-violet-500" />
              <p className="text-2xl font-bold text-brand-800">{dueReviews}</p>
              <p className="text-xs font-semibold text-gray-500">Due review</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg ring-2 ring-brand-200">
          <CardContent className="flex items-center justify-between gap-4 bg-gradient-to-r from-brand-50 via-white to-violet-50 p-6">
            <div className="min-w-0 flex-1">
              <Badge variant="accent" className="mb-2 gap-1">
                <Sparkles className="h-3 w-3" /> Continue
              </Badge>
              <p className="truncate text-lg font-bold text-brand-800">{currentLesson.title}</p>
              <p className="text-sm text-gray-500">Pick up where you left off</p>
            </div>
            <Link href={`/lesson/${currentLesson.id}`} className="shrink-0">
              <Button size="lg" className="shadow-md">
                Start <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {dueReviews > 0 && (
          <Link href="/review">
            <Card className="border-0 shadow-md ring-1 ring-violet-100 transition hover:shadow-lg">
              <CardContent className="flex items-center justify-between bg-gradient-to-r from-violet-50 to-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-xl">
                    🔄
                  </div>
                  <span className="font-semibold text-brand-800">Review {dueReviews} words</span>
                </div>
                <ChevronRight className="h-5 w-5 text-violet-400" />
              </CardContent>
            </Card>
          </Link>
        )}

        <Link href="/practice">
          <Card className="border-0 shadow-md ring-1 ring-emerald-100 transition hover:shadow-lg">
            <CardContent className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
                  🏋️
                </div>
                <div>
                  <span className="font-semibold text-brand-800">Guided practice plan</span>
                  <p className="text-xs text-gray-500">Tones, typing & speaking outside lessons</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-emerald-400" />
            </CardContent>
          </Card>
        </Link>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-500" />
              <h2 className="text-lg font-bold text-brand-800">Your learning path</h2>
            </div>
            <Link href="/course" className="text-sm font-medium text-brand-600 hover:underline">
              Full course
            </Link>
          </div>

          {COURSE_SECTIONS.map((section) => {
            const sectionUnits = getUnitsForSection(section.id)
              .map((def) => units.find((u) => u.id === def.id)!)
              .filter(Boolean);
            const sectionLessons = sectionUnits.flatMap((u) => getLessonsForUnit(lessons, u.id));
            const sectionCompleted = sectionLessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;

            return (
              <div key={section.id} className="space-y-3">
                <div className="rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-brand-800">{section.title}</h3>
                      <p className="text-xs text-gray-500">{section.subtitle}</p>
                    </div>
                    <Badge variant="muted">
                      {sectionCompleted}/{sectionLessons.length}
                    </Badge>
                  </div>
                </div>

                {sectionUnits.map((unit, unitIdx) => {
                  const theme = UNIT_THEMES[unitIdx % UNIT_THEMES.length];
                  const unitLessons = getLessonsForUnit(lessons, unit.id);
                  const unitCompleted = unitLessons.filter((l) =>
                    progress.completedLessonIds.includes(l.id)
                  ).length;

                  return (
                    <Card key={unit.id} className={cn("overflow-hidden border-0 shadow-md ring-1", theme.border)}>
                      <CardHeader className={cn("border-b pb-3", theme.bg)}>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                            <span className="text-xl">{theme.icon}</span>
                            Unit {unit.orderIndex}: {unit.title}
                          </CardTitle>
                          <span className="text-xs font-semibold text-gray-500">
                            {unitCompleted}/{unitLessons.length}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-4">
                        {unitLessons.map((lesson) => {
                          const unlocked = isLessonUnlocked(
                            lesson.id,
                            progress.completedLessonIds,
                            units,
                            lessons
                          );
                          const completed = progress.completedLessonIds.includes(lesson.id);
                          return (
                            <Link
                              key={lesson.id}
                              href={unlocked ? `/lesson/${lesson.id}` : "#"}
                              className={cn(
                                "flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all",
                                completed && "border-green-200 bg-green-50",
                                unlocked && !completed && "border-gray-100 bg-white hover:border-brand-300 hover:shadow-md",
                                !unlocked && "cursor-not-allowed border-gray-50 bg-gray-50 opacity-50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                {!unlocked ? (
                                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                  </span>
                                ) : completed ? (
                                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white shadow">
                                    ✓
                                  </span>
                                ) : (
                                  <span
                                    className={cn(
                                      "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow",
                                      theme.gradient
                                    )}
                                  >
                                    {lesson.orderIndex}
                                  </span>
                                )}
                                <span className="font-medium text-gray-800">{lesson.title}</span>
                              </div>
                              {unlocked && <ChevronRight className="h-5 w-5 text-gray-300" />}
                            </Link>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
