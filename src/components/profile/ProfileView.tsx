"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InkPageHeader, InkPanel, InkProgress, InkStat } from "@/components/ui/ink-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllVocabMemories } from "@/lib/progress";
import { AuthProgressPrompt } from "@/components/errors/AuthProgressPrompt";
import { useProgress } from "@/contexts/ProgressContext";
import { createClient } from "@/lib/supabase/client";
import { LESSON_COUNT } from "@/data/course-content";
import { COURSE_TITLE } from "@/data/starter-hsk1/constants";
import { AchievementShowcase } from "@/components/profile/AchievementShowcase";
import { Star, Flame, BookOpen, RotateCcw, Trash2, LogOut } from "lucide-react";

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-stone-100" />
        ))}
      </div>
      <div className="h-20 rounded-2xl bg-stone-100" />
    </div>
  );
}

export function ProfileView() {
  const { user, progress, loading, error, retryLoad, resetProgress, signOut } = useProgress();
  const [lessonTitles, setLessonTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!progress?.lessonAttempts.length) return;

    const ids = [...new Set(progress.lessonAttempts.map((a) => a.lessonId))].slice(0, 5);
    const supabase = createClient();

    supabase
      .from("lessons")
      .select("id, title")
      .in("id", ids)
      .then(({ data }) => {
        if (data) {
          setLessonTitles(Object.fromEntries(data.map((row) => [row.id, row.title])));
        }
      });
  }, [progress?.lessonAttempts]);

  async function handleReset() {
    if (confirm("Reset all progress? This cannot be undone.")) {
      await resetProgress();
    }
  }

  const memories = progress ? getAllVocabMemories(progress) : [];
  const mastered = memories.filter((m) => m.strength >= 5).length;
  const completedCount = progress?.completedLessonIds.length ?? 0;
  const completionPct = Math.round((completedCount / LESSON_COUNT) * 100);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-brand-300 bg-white text-2xl font-bold text-brand-700 ink-trail-shadow">
            我
          </div>
          <InkPageHeader
            title={user?.user_metadata?.full_name ?? "Learner"}
            subtitle={user?.email ?? COURSE_TITLE}
          />
        </div>

        {loading ? (
          <ProfileSkeleton />
        ) : !progress ? (
          <AuthProgressPrompt error={error} onRetry={retryLoad} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <InkStat icon={<Star className="h-5 w-5 text-amber-500" />} value={progress.xp} label="XP" ring="ring-amber-100" />
              <InkStat icon={<Flame className="h-5 w-5 text-orange-500" />} value={progress.streakCount} label="Streak" ring="ring-orange-100" />
              <InkStat
                icon={<BookOpen className="h-5 w-5 text-brand-500" />}
                value={`${completedCount}/${LESSON_COUNT}`}
                label="Lessons"
                ring="ring-brand-100"
              />
              <InkStat icon={<RotateCcw className="h-5 w-5 text-emerald-500" />} value={mastered} label="Mastered" ring="ring-emerald-100" />
            </div>

            <InkPanel className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-stone-800">Trail progress</p>
                <Badge variant="muted">{completionPct}%</Badge>
              </div>
              <InkProgress value={completionPct} />
            </InkPanel>

            <AchievementShowcase />

            {progress.lessonAttempts.length > 0 && (
              <InkPanel className="p-4">
                <p className="mb-2 text-sm font-bold text-stone-800">Recent steps</p>
                <div className="space-y-1.5">
                  {[...progress.lessonAttempts].reverse().slice(0, 5).map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-xs"
                    >
                      <span className="truncate font-medium text-stone-700">
                        {lessonTitles[attempt.lessonId] ?? attempt.lessonId}
                      </span>
                      <span className="shrink-0 text-stone-500">
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                    </div>
                  ))}
                </div>
              </InkPanel>
            )}

            <Button variant="outline" className="w-full border-error/30 text-error" onClick={handleReset}>
              <Trash2 className="h-4 w-4" /> Reset progress
            </Button>

            <Button variant="secondary" className="w-full" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
