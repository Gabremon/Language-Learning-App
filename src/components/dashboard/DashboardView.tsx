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
import { Flame, Star, RotateCcw, ChevronRight, Lock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold backdrop-blur">
              汉
            </div>
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-brand-100">Continue your Mandarin journey</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <Star className="h-7 w-7 text-accent-400" />
              <p className="text-2xl font-bold text-brand-800">{progress.xp}</p>
              <p className="text-xs font-medium text-gray-500">XP</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <Flame className="h-7 w-7 text-orange-500" />
              <p className="text-2xl font-bold text-brand-800">{progress.streakCount}</p>
              <p className="text-xs font-medium text-gray-500">Day streak</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <RotateCcw className="h-7 w-7 text-brand-500" />
              <p className="text-2xl font-bold text-brand-800">{dueReviews}</p>
              <p className="text-xs font-medium text-gray-500">Due review</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-brand-200 shadow-md">
          <CardContent className="flex items-center justify-between gap-4 bg-gradient-to-r from-brand-50 to-white p-6">
            <div className="min-w-0 flex-1">
              <Badge variant="accent" className="mb-2">Continue</Badge>
              <p className="truncate font-bold text-brand-800">{currentLesson.title}</p>
              <p className="text-sm text-gray-500">Pick up where you left off</p>
            </div>
            <Link href={`/lesson/${currentLesson.id}`} className="shrink-0">
              <Button size="lg" className="shadow-sm">
                Start <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {dueReviews > 0 && (
          <Link href="/review">
            <Card className="shadow-sm transition hover:border-brand-300 hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100">
                    <RotateCcw className="h-5 w-5 text-brand-600" />
                  </div>
                  <span className="font-semibold text-brand-800">Review {dueReviews} words</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-500" />
            <h2 className="text-lg font-bold text-brand-800">Your path</h2>
          </div>
          {units.map((unit) => (
            <Card key={unit.id} className="shadow-sm">
              <CardHeader className="border-b border-brand-50 bg-brand-50/50 pb-3">
                <CardTitle className="text-base text-brand-700">
                  Unit {unit.orderIndex}: {unit.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                {getLessonsForUnit(lessons, unit.id).map((lesson) => {
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
                        "flex items-center justify-between rounded-xl border-2 px-4 py-3 transition",
                        completed && "border-success/50 bg-green-50",
                        unlocked && !completed && "border-brand-200 bg-white hover:border-brand-400 hover:shadow-sm",
                        !unlocked && "cursor-not-allowed border-gray-100 bg-gray-50 opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {!unlocked ? (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </span>
                        ) : completed ? (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-sm font-bold text-white shadow-sm">
                            ✓
                          </span>
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white shadow-sm">
                            {lesson.orderIndex}
                          </span>
                        )}
                        <span className="font-medium text-gray-800">{lesson.title}</span>
                      </div>
                      {unlocked && <ChevronRight className="h-5 w-5 text-brand-400" />}
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
