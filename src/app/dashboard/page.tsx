"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { course, units, lessons, getLessonsForUnit, isLessonUnlocked } from "@/data/seed";
import { loadProgress } from "@/lib/progress";
import { getAllVocabMemories } from "@/lib/progress";
import { getDueReviewCount } from "@/lib/srs";
import type { UserProgress } from "@/lib/progress";
import { Flame, Star, RotateCcw, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AppShell>
    );
  }

  const dueReviews = getDueReviewCount(getAllVocabMemories(progress));
  const currentLesson = lessons.find((l) => l.id === progress.currentLessonId) ?? lessons[0];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">{course.title}</h1>
          <p className="text-gray-500">Continue your Mandarin journey</p>
        </div>

        <div className="flex gap-3">
          <Card className="flex-1">
            <CardContent className="flex items-center gap-3 p-4">
              <Star className="h-8 w-8 text-accent-400" />
              <div>
                <p className="text-2xl font-bold text-brand-800">{progress.xp}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="flex items-center gap-3 p-4">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-brand-800">{progress.streakCount}</p>
                <p className="text-xs text-gray-500">Day streak</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="flex items-center gap-3 p-4">
              <RotateCcw className="h-8 w-8 text-brand-500" />
              <div>
                <p className="text-2xl font-bold text-brand-800">{dueReviews}</p>
                <p className="text-xs text-gray-500">Due review</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-white">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <Badge variant="accent" className="mb-2">Continue</Badge>
              <p className="font-bold text-brand-800">{currentLesson.title}</p>
              <p className="text-sm text-gray-500">Pick up where you left off</p>
            </div>
            <Link href={`/lesson/${currentLesson.id}`}>
              <Button size="lg">
                Start <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {dueReviews > 0 && (
          <Link href="/review">
            <Card className="transition hover:border-brand-300 hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-6 w-6 text-brand-500" />
                  <span className="font-semibold">Review {dueReviews} words</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-800">Your path</h2>
          {units.map((unit) => (
            <Card key={unit.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-brand-600">
                  Unit {unit.orderIndex}: {unit.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {getLessonsForUnit(unit.id).map((lesson) => {
                  const unlocked = isLessonUnlocked(lesson.id, progress.completedLessonIds);
                  const completed = progress.completedLessonIds.includes(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={unlocked ? `/lesson/${lesson.id}` : "#"}
                      className={cn(
                        "flex items-center justify-between rounded-xl border-2 px-4 py-3 transition",
                        completed && "border-success bg-green-50",
                        unlocked && !completed && "border-brand-200 hover:border-brand-400",
                        !unlocked && "border-gray-100 opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {!unlocked ? (
                          <Lock className="h-5 w-5 text-gray-400" />
                        ) : completed ? (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-sm font-bold text-white">✓</span>
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                            {lesson.orderIndex}
                          </span>
                        )}
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      {unlocked && <ChevronRight className="h-5 w-5 text-gray-400" />}
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
