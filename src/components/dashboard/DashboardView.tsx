"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CourseCatalog } from "@/lib/course-utils";
import { getActiveUnit, getLessonsForUnit, isLessonUnlocked } from "@/lib/course-utils";
import { getDueReviewCount } from "@/lib/srs";
import { useProgress } from "@/contexts/ProgressContext";
import { APP_NAME } from "@/lib/brand";
import { Flame, Star, RotateCcw, ChevronRight, Sparkles, Map } from "lucide-react";
import { COURSE_SECTIONS, getUnitsForSection } from "@/data/course-content";
import { SECTION_STYLES } from "@/lib/unit-themes";
import { MiniTrail } from "@/components/course/ink-trail/MiniTrail";
import { cn } from "@/lib/utils";

interface Props {
  catalog: CourseCatalog;
}

export function DashboardView({ catalog }: Props) {
  const { course, units, lessons } = catalog;
  const { progress, loading, getAllMemories } = useProgress();

  if (loading || !progress) {
    return (
      <AppShell variant="paper">
        <DashboardSkeleton />
      </AppShell>
    );
  }

  const dueReviews = getDueReviewCount(getAllMemories());
  const currentLesson = lessons.find((l) => l.id === progress.currentLessonId) ?? lessons[0];
  const completedCount = progress.completedLessonIds.length;
  const totalLessons = lessons.length;
  const activeUnit = getActiveUnit(units, lessons, progress.completedLessonIds);
  const activeUnitLessons = getLessonsForUnit(lessons, activeUnit.id);
  const upcomingLessons = activeUnitLessons
    .filter((l) => !progress.completedLessonIds.includes(l.id))
    .slice(0, 5);
  const remainingInUnit =
    activeUnitLessons.filter((l) => !progress.completedLessonIds.includes(l.id)).length -
    upcomingLessons.length;

  const miniTrailItems = upcomingLessons.map((lesson) => ({
    lesson,
    unlocked: isLessonUnlocked(lesson.id, progress.completedLessonIds, units, lessons),
    completed: false,
    isCurrent: lesson.id === currentLesson.id,
  }));

  return (
    <AppShell variant="paper">
      <div className="space-y-4">
        <header className="relative overflow-hidden rounded-2xl border border-brand-200/50 bg-gradient-to-br from-brand-500 via-brand-600 to-violet-700 p-4 text-white shadow-lg">
          <div className="pointer-events-none absolute -right-2 -top-4 text-7xl font-bold opacity-10">环</div>
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 text-xl font-bold backdrop-blur">
              环
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-100/80">{APP_NAME}</p>
              <h1 className="text-lg font-bold">{course.title}</h1>
              <p className="text-xs text-brand-100">
                {completedCount}/{totalLessons} steps · {Math.round((completedCount / totalLessons) * 100)}%
              </p>
            </div>
          </div>
          <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-white transition-all duration-500"
              style={{ width: `${(completedCount / totalLessons) * 100}%` }}
            />
          </div>
        </header>

        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Star, value: progress.xp, label: "XP", color: "text-amber-500", ring: "ring-amber-100" },
            { icon: Flame, value: progress.streakCount, label: "Streak", color: "text-orange-500", ring: "ring-orange-100" },
            { icon: RotateCcw, value: dueReviews, label: "Review", color: "text-violet-500", ring: "ring-violet-100" },
          ].map(({ icon: Icon, value, label, color, ring }) => (
            <Card key={label} className={cn("border-0 bg-white/80 shadow-sm ring-1 backdrop-blur", ring)}>
              <CardContent className="flex flex-col items-center gap-0.5 p-2.5 text-center">
                <Icon className={cn("h-5 w-5", color)} />
                <p className="text-lg font-bold text-stone-800">{value}</p>
                <p className="text-[10px] font-semibold text-stone-500">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden border-0 bg-white/90 shadow-md ring-1 ring-brand-200/80">
          <CardContent className="flex items-center justify-between gap-3 p-3.5">
            <div className="min-w-0 flex-1">
              <Badge variant="accent" className="mb-1.5 gap-1 px-1.5 py-0 text-[10px]">
                <Sparkles className="h-2.5 w-2.5" /> Continue the trail
              </Badge>
              <p className="truncate text-sm font-bold text-stone-800">{currentLesson.title}</p>
            </div>
            <Link href={`/lesson/${currentLesson.id}`} className="shrink-0">
              <Button size="sm" className="h-9 px-4 text-xs shadow-md">
                Go <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <MiniTrail unit={activeUnit} items={miniTrailItems} remainingCount={remainingInUnit} />

        {dueReviews > 0 && (
          <Link href="/review">
            <Card className="border-0 bg-white/80 shadow-sm ring-1 ring-violet-100 transition hover:shadow-md">
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔄</span>
                  <span className="text-sm font-semibold text-stone-800">Review {dueReviews} words</span>
                </div>
                <ChevronRight className="h-4 w-4 text-violet-400" />
              </CardContent>
            </Card>
          </Link>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Map className="h-4 w-4 text-brand-500" />
              <h2 className="text-sm font-bold text-stone-800">Trail map</h2>
            </div>
            <Link href="/course" className="text-xs font-semibold text-brand-600 hover:underline">
              Open full path →
            </Link>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {COURSE_SECTIONS.map((section) => {
              const sectionUnits = getUnitsForSection(section.id)
                .map((def) => units.find((u) => u.id === def.id)!)
                .filter(Boolean);
              const sectionLessons = sectionUnits.flatMap((u) => getLessonsForUnit(lessons, u.id));
              const sectionCompleted = sectionLessons.filter((l) =>
                progress.completedLessonIds.includes(l.id)
              ).length;
              const pct = sectionLessons.length
                ? Math.round((sectionCompleted / sectionLessons.length) * 100)
                : 0;
              const style = SECTION_STYLES[section.id];

              return (
                <Link key={section.id} href="/course">
                  <Card
                    className={cn(
                      "border bg-gradient-to-br shadow-sm transition hover:shadow-md",
                      style.border,
                      style.paper
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-sm font-bold"
                          style={{ color: style.accent }}
                        >
                          {style.glyph}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-800">{section.title}</p>
                          <p className="text-[10px] text-stone-500">
                            {sectionCompleted}/{sectionLessons.length} steps
                          </p>
                        </div>
                        <span className="text-xs font-bold" style={{ color: style.accent }}>
                          {pct}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
