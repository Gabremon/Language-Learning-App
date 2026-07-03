"use client";

import { Button } from "@/components/ui/button";
import { InkPanel } from "@/components/ui/ink-shell";
import { Badge } from "@/components/ui/badge";
import { getLessonDisplayTitle } from "@/lib/lesson-titles";
import type { Lesson } from "@/types/course";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

interface Props {
  lesson: Lesson | null;
  nextLesson: Lesson | null;
  score: number;
  total: number;
  xpGained: number;
  missedCount?: number;
  isGuest?: boolean;
}

export function LessonComplete({
  lesson,
  nextLesson,
  score,
  total,
  xpGained,
  missedCount = 0,
  isGuest = false,
}: Props) {
  const pct = Math.round((score / total) * 100);
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
  const perfectFirstTry = score === total;

  return (
    <div className="animate-bounce-in mx-auto max-w-lg space-y-5 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 text-3xl font-bold text-amber-700 ink-trail-shadow">
        成
      </div>
      <div>
        <h1 className="text-2xl font-bold text-stone-800">
          {perfectFirstTry ? "Perfect lesson!" : isGuest ? "Demo complete!" : "Step complete"}
        </h1>
        <p className="text-sm text-stone-500">{lesson ? getLessonDisplayTitle(lesson) : null}</p>
        {isGuest && (
          <p className="mt-2 text-sm text-brand-700">
            Sign in to save your XP and pick up where you left off.
          </p>
        )}
      </div>

      <InkPanel className="p-5" tint="#FEF3C7">
        <div className="flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              className={`h-10 w-10 ${
                i < stars ? "fill-amber-400 text-amber-400" : "text-stone-200"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-4xl font-bold text-stone-800">
          {score}/{total}
        </p>
        <p className="text-sm text-stone-600">first-try accuracy</p>
        {missedCount > 0 && (
          <p className="mt-1 text-xs text-amber-700">
            You missed {missedCount} question{missedCount === 1 ? "" : "s"} before passing
          </p>
        )}
        <Badge variant="accent" className="mt-3 px-4 py-1 text-sm font-bold">
          +{xpGained} XP{isGuest ? " (demo)" : ""}
        </Badge>
      </InkPanel>

      <div className="flex flex-col gap-2">
        {isGuest ? (
          <Link href="/auth">
            <Button size="lg" className="w-full gap-2">
              Sign up to save progress
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        ) : (
          nextLesson && (
            <Link href={`/lesson/${nextLesson.id}`}>
              <Button size="lg" className="w-full">
                Next: {getLessonDisplayTitle(nextLesson)}
              </Button>
            </Link>
          )
        )}
        <Link href={isGuest ? "/" : "/dashboard"}>
          <Button variant="secondary" size="lg" className="w-full">
            {isGuest ? "Back to home" : "Back to trail"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
