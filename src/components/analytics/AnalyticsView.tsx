"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { InkPageHeader, InkPanel, InkStat } from "@/components/ui/ink-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import { useProgress } from "@/contexts/ProgressContext";
import type { AnalyticsSnapshot } from "@/lib/data/analytics";
import { Activity, BarChart3, BookOpen, RefreshCw, Users } from "lucide-react";

function formatDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function AnalyticsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <p className="text-center text-xs text-stone-400">Loading stats…</p>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-stone-100" />
        ))}
      </div>
      <div className="h-40 rounded-2xl bg-stone-100" />
      <div className="h-48 rounded-2xl bg-stone-100" />
    </div>
  );
}

export function AnalyticsView() {
  const { user } = useProgress();
  const { isAdmin, checked } = useAdmin();
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load analytics");
      }
      setSnapshot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
      setSnapshot(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (!isAdmin) return;
    loadAnalytics();
  }, [checked, isAdmin, loadAnalytics]);

  const maxDaily = Math.max(...(snapshot?.dailyCompletions.map((d) => d.count) ?? [1]), 1);
  const waitingForAccess = !checked;
  const denied = checked && !isAdmin;

  return (
    <AppShell variant="paper">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <InkPageHeader
            eyebrow="Admin"
            title="Analytics"
            subtitle="Learner activity across Ori"
            glyph="析"
          />
          {isAdmin && (
            <Button size="sm" variant="outline" onClick={loadAnalytics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>

        {waitingForAccess ? (
          <AnalyticsSkeleton />
        ) : denied ? (
          <InkPanel className="space-y-3 p-4">
            <p className="text-sm font-semibold text-stone-800">Admin access required</p>
            <p className="text-sm text-stone-600">
              Signed in as <span className="font-medium">{user?.email ?? "unknown"}</span>. Add
              this email to <code className="text-stone-800">ADMIN_EMAILS</code> in your{" "}
              <code className="text-stone-800">.env</code>, then restart the dev server.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex h-8 items-center justify-center rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Back to Learn
            </Link>
          </InkPanel>
        ) : loading && !snapshot ? (
          <AnalyticsSkeleton />
        ) : error ? (
          <InkPanel className="space-y-3 p-4">
            <p className="text-sm font-semibold text-stone-800">Couldn&apos;t load stats</p>
            <p className="text-sm text-red-600">{error}</p>
            <p className="text-xs text-stone-500">
              In Supabase → Project Settings → API, copy the{" "}
              <span className="font-medium text-stone-700">service_role</span> key (the long{" "}
              <code className="text-stone-700">eyJ…</code> JWT, not the short{" "}
              <code className="text-stone-700">sb_secret_</code> key) into{" "}
              <code className="text-stone-700">SUPABASE_SERVICE_ROLE_KEY</code>.
            </p>
            <Button size="sm" onClick={loadAnalytics}>
              Retry
            </Button>
          </InkPanel>
        ) : snapshot ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <InkStat
                icon={<Users className="h-5 w-5 text-brand-500" />}
                value={snapshot.totalUsers}
                label="Learners"
                ring="ring-brand-100"
              />
              <InkStat
                icon={<BookOpen className="h-5 w-5 text-emerald-500" />}
                value={snapshot.totalLessonAttempts}
                label="Lesson runs"
                ring="ring-emerald-100"
              />
              <InkStat
                icon={<Activity className="h-5 w-5 text-orange-500" />}
                value={snapshot.activeLast7Days}
                label="Active (7d)"
                ring="ring-orange-100"
              />
              <InkStat
                icon={<BarChart3 className="h-5 w-5 text-violet-500" />}
                value={snapshot.activeToday}
                label="Active today"
                ring="ring-violet-100"
              />
            </div>

            {snapshot.totalUsers === 0 && snapshot.totalLessonAttempts === 0 ? (
              <InkPanel className="p-4 text-sm text-stone-600">
                No learner activity yet. Stats will appear once people sign up and complete lessons.
              </InkPanel>
            ) : null}

            <InkPanel className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-stone-800">Lesson completions (14 days)</p>
                <Badge variant="muted">{snapshot.totalLessonAttempts} total</Badge>
              </div>
              <div className="flex h-28 items-end gap-1">
                {snapshot.dailyCompletions.map((day) => (
                  <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-brand-500/80 transition-all"
                      style={{ height: `${Math.max(8, (day.count / maxDaily) * 100)}%` }}
                      title={`${day.date}: ${day.count}`}
                    />
                    <span className="text-[9px] text-stone-400">{formatDate(day.date)}</span>
                  </div>
                ))}
              </div>
            </InkPanel>

            <InkPanel className="p-4">
              <p className="mb-2 text-sm font-bold text-stone-800">Overview</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                <p>Unique lessons completed: {snapshot.uniqueLessonsCompleted}</p>
                <p>Total XP earned: {snapshot.totalXp.toLocaleString()}</p>
                <p>Avg lessons / learner: {snapshot.avgLessonsPerUser}</p>
                <p>Updated: {new Date(snapshot.generatedAt).toLocaleTimeString()}</p>
              </div>
            </InkPanel>

            {snapshot.topLessons.length > 0 && (
              <InkPanel className="p-4">
                <p className="mb-2 text-sm font-bold text-stone-800">Top lessons</p>
                <div className="space-y-1.5">
                  {snapshot.topLessons.map((lesson) => (
                    <div
                      key={lesson.lessonId}
                      className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-xs"
                    >
                      <span className="truncate font-medium text-stone-700">{lesson.title}</span>
                      <span className="shrink-0 text-stone-500">{lesson.completions}</span>
                    </div>
                  ))}
                </div>
              </InkPanel>
            )}

            {snapshot.learners.length > 0 && (
              <InkPanel className="p-4">
                <p className="mb-2 text-sm font-bold text-stone-800">Recent learners</p>
                <div className="space-y-1.5">
                  {snapshot.learners.map((learner) => (
                    <div
                      key={`${learner.email}-${learner.lastActive}`}
                      className="flex items-center justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-stone-700">{learner.email}</p>
                        <p className="text-stone-400">
                          {learner.lessonCount} lessons · {learner.xp} XP · streak {learner.streak}
                        </p>
                      </div>
                      <span className="shrink-0 text-stone-400">
                        {learner.lastActive ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </InkPanel>
            )}
          </>
        ) : (
          <InkPanel className="p-4 text-sm text-stone-600">
            Stats didn&apos;t load. Try the refresh button above.
          </InkPanel>
        )}
      </div>
    </AppShell>
  );
}
