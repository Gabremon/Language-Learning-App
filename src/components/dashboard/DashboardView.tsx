"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { AuthProgressPrompt } from "@/components/errors/AuthProgressPrompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CourseCatalog } from "@/lib/course-utils";
import { getActiveUnit, getContinueLesson, getLessonsForUnit, isLessonUnlocked } from "@/lib/course-utils";
import { countDueReviewsInPracticePool, countPracticeWordsAvailable } from "@/lib/practice-vocab";
import { lessonVocabMap } from "@/lib/lesson-vocab-map";
import { useProgress } from "@/contexts/ProgressContext";
import { APP_MARK, APP_NAME } from "@/lib/brand";
import { Flame, Star, RotateCcw, ChevronRight, Sparkles } from "lucide-react";
import { MiniTrail } from "@/components/course/ink-trail/MiniTrail";
import { QuestCards } from "@/components/dashboard/QuestCards";
import { PracticeSection } from "@/components/dashboard/PracticeSection";
import { useGamification } from "@/contexts/GamificationContext";
import { cn } from "@/lib/utils";
import { getLessonDisplayTitle } from "@/lib/lesson-titles";

interface Props {
  catalog: CourseCatalog;
}

export function DashboardView({ catalog }: Props) {
  const { course, units, lessons } = catalog;
  const { progress, loading, error, retryLoad, getAllMemories } = useProgress();
  const { level, state } = useGamification();

  if (loading) {
    return (
      <AppShell variant="paper">
        <DashboardSkeleton />
      </AppShell>
    );
  }

  if (!progress) {
    return (
      <AppShell variant="paper">
        <AuthProgressPrompt error={error} onRetry={retryLoad} />
      </AppShell>
    );
  }

  const practiceContext = {
    lessons,
    units,
    lessonVocabMap,
    vocabItems: [],
  };
  const dueReviews = countDueReviewsInPracticePool(progress, getAllMemories(), practiceContext);
  const practiceWords = countPracticeWordsAvailable(progress, practiceContext);
  const currentLesson = getContinueLesson(
    lessons,
    units,
    progress.currentLessonId,
    progress.completedLessonIds
  );
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
          <div className="pointer-events-none absolute -right-2 -top-4 text-7xl font-bold opacity-10">{APP_MARK}</div>
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 text-xl font-bold backdrop-blur">
              {APP_MARK}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-100/80">{APP_NAME}</p>
              <h1 className="text-lg font-bold">{course.title}</h1>
              <p className="text-xs text-brand-100">
                Level {level.level}: {level.title} · {completedCount}/{totalLessons} steps
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
              <p className="truncate text-sm font-bold text-stone-800">{getLessonDisplayTitle(currentLesson)}</p>
            </div>
            <Link href={`/lesson/${currentLesson.id}`} className="shrink-0">
              <Button size="sm" className="h-9 px-4 text-xs shadow-md">
                Go <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <MiniTrail unit={activeUnit} items={miniTrailItems} remainingCount={remainingInUnit} />

        <PracticeSection
          dueReviews={dueReviews}
          practiceWords={practiceWords}
          sprintBestScore={state.gauntletBestScore}
        />

        <QuestCards />
      </div>
    </AppShell>
  );
}
