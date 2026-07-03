"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { InkPageHeader, InkPanel, InkProgress } from "@/components/ui/ink-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/contexts/ProgressContext";
import {
  getCategoryLabel,
  getSessionSummary,
  inferPracticeBand,
  type GuidedStep,
  type PracticeBand,
} from "@/data/practice-plan";
import {
  Check,
  ChevronRight,
  Clock,
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

const CATEGORY_ICONS = {
  tone: Sparkles,
  listening: Headphones,
  typing: Keyboard,
  character: Type,
  speaking: MessageCircle,
  review: RefreshCw,
  immersion: Sun,
};

const STORAGE_KEY = "ink-practice-progress";

interface SavedProgress {
  date: string;
  completedStepIds: string[];
  currentStepIndex: number;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadProgress(): SavedProgress {
  if (typeof window === "undefined") {
    return { date: todayKey(), completedStepIds: [], currentStepIndex: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), completedStepIds: [], currentStepIndex: 0 };
    const parsed = JSON.parse(raw) as SavedProgress;
    if (parsed.date !== todayKey()) {
      return { date: todayKey(), completedStepIds: [], currentStepIndex: 0 };
    }
    return parsed;
  } catch {
    return { date: todayKey(), completedStepIds: [], currentStepIndex: 0 };
  }
}

function saveProgress(progress: SavedProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function StepCard({
  step,
  stepNumber,
  totalSteps,
  isCurrent,
  isDone,
  onComplete,
}: {
  step: GuidedStep;
  stepNumber: number;
  totalSteps: number;
  isCurrent: boolean;
  isDone: boolean;
  onComplete: () => void;
}) {
  const Icon = CATEGORY_ICONS[step.category];
  const isFirstInActivity = step.stepIndex === 0;
  const isLastInActivity = step.stepIndex === step.totalStepsInActivity - 1;

  if (!isCurrent && !isDone) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 opacity-40">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-stone-200 text-[10px] font-bold text-stone-500">
          {stepNumber}
        </span>
        <p className="truncate text-xs text-stone-500">{step.stepText}</p>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50/80 px-2 py-1.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white">
          <Check className="h-3.5 w-3.5" />
        </span>
        <p className="truncate text-xs text-stone-600 line-through decoration-stone-400">{step.stepText}</p>
      </div>
    );
  }

  return (
    <InkPanel className="overflow-hidden ring-2 ring-brand-300/50">
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
              Step {stepNumber} of {totalSteps}
            </p>
            <p className="text-[10px] text-stone-500">{step.blockLabel}</p>
          </div>
          <Badge variant="muted" className="shrink-0 text-[10px]">
            {getCategoryLabel(step.category)}
          </Badge>
        </div>

        {isFirstInActivity && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ background: "linear-gradient(145deg, #0284C7, #075985)" }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-stone-800">{step.activityTitle}</p>
              <p className="flex items-center gap-1 text-[10px] text-stone-500">
                <Clock className="h-3 w-3" /> ~{step.durationMinutes} min
              </p>
            </div>
          </div>
        )}

        <p className="text-sm leading-relaxed text-stone-800">{step.stepText}</p>

        {step.tips && step.tips.length > 0 && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong>Tip:</strong> {step.tips.join(" ")}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {step.href && isLastInActivity && (
            <Link
              href={step.href}
              className={cn(buttonVariants({ size: "sm" }), "text-xs")}
            >
              Open in app
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
          <Button size="sm" className="text-xs" onClick={onComplete}>
            Done — next step
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <p className="mt-2 text-[10px] text-stone-400">
          Activity step {step.stepIndex + 1}/{step.totalStepsInActivity} · {step.blockTitle}
        </p>
      </div>
    </InkPanel>
  );
}

export function PracticeView() {
  const { progress, loading } = useProgress();
  const [saved, setSaved] = useState<SavedProgress | null>(null);
  const [bandOverride, setBandOverride] = useState<PracticeBand | null>(null);

  useEffect(() => {
    setSaved(loadProgress());
  }, []);

  useEffect(() => {
    if (bandOverride === null) return;
    const fresh = { date: todayKey(), completedStepIds: [], currentStepIndex: 0 };
    setSaved(fresh);
    saveProgress(fresh);
  }, [bandOverride]);

  const inferredBand = useMemo(
    () => inferPracticeBand(progress?.completedLessonIds.length ?? 0),
    [progress?.completedLessonIds.length]
  );
  const band = bandOverride ?? inferredBand;
  const { plan, steps, totalSteps, dailyMinutes } = useMemo(
    () => getSessionSummary(band),
    [band]
  );

  const currentStepIndex = saved?.currentStepIndex ?? 0;
  const completedIds = useMemo(() => new Set(saved?.completedStepIds ?? []), [saved?.completedStepIds]);
  const completedCount = completedIds.size;
  const allDone = completedCount >= totalSteps;
  const currentStep = steps[currentStepIndex];

  const markCurrentDone = useCallback(() => {
    if (!currentStep) return;
    const next: SavedProgress = {
      date: todayKey(),
      completedStepIds: [...completedIds, currentStep.id],
      currentStepIndex: Math.min(currentStepIndex + 1, totalSteps),
    };
    setSaved(next);
    saveProgress(next);
  }, [completedIds, currentStep, currentStepIndex, totalSteps]);

  const resetToday = useCallback(() => {
    const fresh = { date: todayKey(), completedStepIds: [], currentStepIndex: 0 };
    setSaved(fresh);
    saveProgress(fresh);
  }, []);

  if (loading || !progress || !saved) {
    return (
      <AppShell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-stone-500">Preparing today&apos;s practice...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <InkPageHeader
          eyebrow="练 · Practice studio"
          title="Today's guided session"
          subtitle={`~${dailyMinutes} min · follow each step in order`}
          glyph="练"
        />

        <InkPanel className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-stone-800">{plan.label}</p>
              <p className="text-[10px] text-stone-500">{plan.summary}</p>
            </div>
            <div className="flex gap-1">
              {(["starter", "hsk1"] as PracticeBand[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBandOverride(b)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
                    band === b
                      ? "bg-brand-500 text-white"
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  )}
                >
                  {b === "starter" ? "Starter" : "HSK 1"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] font-semibold text-stone-500">
              <span>{allDone ? "Session complete!" : `Step ${Math.min(currentStepIndex + 1, totalSteps)} of ${totalSteps}`}</span>
              <span>{completedCount}/{totalSteps}</span>
            </div>
            <InkProgress value={(completedCount / totalSteps) * 100} />
          </div>
        </InkPanel>

        {allDone ? (
          <InkPanel className="p-6 text-center" tint="#D1FAE5">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-emerald-400 bg-white text-2xl font-bold text-emerald-600">
              成
            </div>
            <h2 className="text-lg font-bold text-stone-800">Practice complete for today</h2>
            <p className="mt-1 text-sm text-stone-600">{plan.weeklyGoal}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/dashboard" className={buttonVariants()}>
                Back to trail
              </Link>
              <Button variant="outline" size="sm" onClick={resetToday}>
                Practice again
              </Button>
            </div>
          </InkPanel>
        ) : (
          <>
            {currentStep && (
              <StepCard
                step={currentStep}
                stepNumber={currentStepIndex + 1}
                totalSteps={totalSteps}
                isCurrent
                isDone={false}
                onComplete={markCurrentDone}
              />
            )}

            <InkPanel className="p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Today&apos;s route
              </p>
              <div className="space-y-1">
                {plan.dailyBlocks.map((block) => (
                  <div key={block.id} className="rounded-lg bg-stone-50/80 px-2.5 py-2">
                    <p className="text-[10px] font-bold text-brand-600">{block.timeLabel}</p>
                    <p className="text-xs font-semibold text-stone-700">{block.title}</p>
                  </div>
                ))}
              </div>
            </InkPanel>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Upcoming</p>
              {steps.slice(currentStepIndex + 1, currentStepIndex + 4).map((step, i) => (
                <StepCard
                  key={step.id}
                  step={step}
                  stepNumber={currentStepIndex + 2 + i}
                  totalSteps={totalSteps}
                  isCurrent={false}
                  isDone={false}
                  onComplete={() => {}}
                />
              ))}
            </div>
          </>
        )}

        <InkPanel className="flex items-center justify-between gap-3 p-3">
          <div>
            <p className="text-xs font-bold text-stone-800">Daily review first</p>
            <p className="text-[10px] text-stone-500">SRS locks in what lessons teach</p>
          </div>
          <Link href="/review" className={buttonVariants({ size: "sm", variant: "outline" })}>
            Review
          </Link>
        </InkPanel>
      </div>
    </AppShell>
  );
}
