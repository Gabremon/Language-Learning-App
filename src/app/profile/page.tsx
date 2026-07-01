"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loadProgress } from "@/lib/progress";
import { getAllVocabMemories } from "@/lib/progress";
import type { UserProgress } from "@/lib/progress";
import { lessons, course } from "@/data/seed";
import { Star, Flame, BookOpen, RotateCcw, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function handleReset() {
    if (confirm("Reset all progress? This cannot be undone.")) {
      localStorage.removeItem("mandarin-learn-progress");
      setProgress(loadProgress());
    }
  }

  if (!progress) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AppShell>
    );
  }

  const memories = getAllVocabMemories(progress);
  const mastered = memories.filter((m) => m.strength >= 5).length;
  const completionPct = Math.round(
    (progress.completedLessonIds.length / lessons.length) * 100
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-3xl font-bold text-white">
            学
          </div>
          <h1 className="text-2xl font-bold text-brand-800">Learner</h1>
          <p className="text-gray-500">{course.title}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <Star className="mb-2 h-8 w-8 text-accent-400" />
              <p className="text-2xl font-bold">{progress.xp}</p>
              <p className="text-xs text-gray-500">Total XP</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <Flame className="mb-2 h-8 w-8 text-orange-500" />
              <p className="text-2xl font-bold">{progress.streakCount}</p>
              <p className="text-xs text-gray-500">Day streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <BookOpen className="mb-2 h-8 w-8 text-brand-500" />
              <p className="text-2xl font-bold">{progress.completedLessonIds.length}/{lessons.length}</p>
              <p className="text-xs text-gray-500">Lessons done</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <RotateCcw className="mb-2 h-8 w-8 text-green-500" />
              <p className="text-2xl font-bold">{mastered}</p>
              <p className="text-xs text-gray-500">Words mastered</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span>{completionPct}% complete</span>
              <Badge variant="default">{progress.completedLessonIds.length} lessons</Badge>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {progress.lessonAttempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[...progress.lessonAttempts].reverse().slice(0, 5).map((attempt) => {
                const lesson = lessons.find((l) => l.id === attempt.lessonId);
                return (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-2 text-sm"
                  >
                    <span className="font-medium">{lesson?.title ?? attempt.lessonId}</span>
                    <span className="text-gray-500">
                      {attempt.score}/{attempt.totalQuestions}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Button variant="outline" className="w-full text-error border-error/30" onClick={handleReset}>
          <Trash2 className="h-4 w-4" /> Reset progress
        </Button>
      </div>
    </AppShell>
  );
}
