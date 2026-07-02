"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getActivitiesForBand,
  getWeeklyPlan,
  getActivityById,
  getCategoryLabel,
  type PracticeBand,
  type PracticeActivity,
} from "@/data/practice-plan";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Headphones,
  Keyboard,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Sun,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BAND_OPTIONS: { id: PracticeBand; label: string }[] = [
  { id: "starter", label: "Starter" },
  { id: "hsk1", label: "HSK 1" },
  { id: "all", label: "Full path" },
];

const CATEGORY_ICONS = {
  tone: Sparkles,
  listening: Headphones,
  typing: Keyboard,
  character: Type,
  speaking: MessageCircle,
  review: RefreshCw,
  immersion: Sun,
};

function ActivityCard({ activity, defaultOpen = false }: { activity: PracticeActivity; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = CATEGORY_ICONS[activity.category];

  return (
    <Card className="overflow-hidden border-brand-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-brand-50/50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-brand-900">{activity.title}</h3>
            <Badge variant="muted" className="text-xs">
              {getCategoryLabel(activity.category)}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {activity.durationMinutes} min
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
        </div>
        {open ? (
          <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
        )}
      </button>
      {open && (
        <CardContent className="border-t border-brand-50 bg-brand-50/30 pt-4">
          <ol className="space-y-2">
            {activity.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {activity.tips && activity.tips.length > 0 && (
            <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <strong>Tip:</strong> {activity.tips.join(" ")}
            </div>
          )}
          {activity.href && (
            <Link
              href={activity.href}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4 inline-flex")}
            >
              Open in app
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export function PracticeView() {
  const [band, setBand] = useState<PracticeBand>("all");

  const plan = useMemo(() => getWeeklyPlan(band), [band]);
  const activities = useMemo(() => getActivitiesForBand(band), [band]);
  const planActivities = useMemo(
    () =>
      plan.activityIds
        .map((id) => getActivityById(id))
        .filter((a): a is PracticeActivity => a != null),
    [plan]
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-brand-800">Practice Plan</h1>
          <p className="mt-1 text-gray-600">
            Structured activities for learning outside lessons — tones, typing, speaking, and review.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {BAND_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setBand(opt.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                band === opt.id
                  ? "bg-brand-500 text-white shadow-md"
                  : "bg-white text-gray-600 ring-1 ring-brand-100 hover:bg-brand-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Card className="border-brand-200 bg-gradient-to-br from-brand-50 to-violet-50">
          <CardHeader>
            <CardTitle className="text-brand-800">{plan.label} — daily routine</CardTitle>
            <p className="text-sm text-gray-600">{plan.summary}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Daily target</span>
                <p className="font-semibold text-brand-700">{plan.dailyMinutes} minutes</p>
              </div>
              <div>
                <span className="text-gray-500">Weekly goal</span>
                <p className="font-semibold text-brand-700">{plan.weeklyGoal}</p>
              </div>
            </div>
            <div className="space-y-3">
              {plan.dailyBlocks.map((block) => (
                <div
                  key={block.id}
                  className="rounded-xl border border-white/80 bg-white/70 p-4 shadow-sm"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
                    {block.timeLabel}
                  </p>
                  <p className="font-semibold text-brand-900">{block.title}</p>
                  <ul className="mt-2 space-y-1">
                    {block.activities.map((actId) => {
                      const act = getActivityById(actId);
                      return act ? (
                        <li key={actId} className="text-sm text-gray-600">
                          • {act.title}{" "}
                          <span className="text-gray-400">({act.durationMinutes} min)</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="mb-3 text-lg font-bold text-brand-800">Recommended this week</h2>
          <div className="space-y-3">
            {planActivities.slice(0, 5).map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-brand-800">All activities</h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>

        <Card className="border-dashed border-brand-200 bg-white">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-brand-800">Pair with in-app review</p>
              <p className="text-sm text-gray-500">
                SRS review is the backbone of retention — do it daily before optional drills.
              </p>
            </div>
            <Link href="/review" className={buttonVariants()}>
              Start review
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
