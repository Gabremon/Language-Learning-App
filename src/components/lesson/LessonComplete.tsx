"use client";

import { Button } from "@/components/ui/button";
import { InkPanel } from "@/components/ui/ink-shell";
import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@/types/course";
import Link from "next/link";
import { Star } from "lucide-react";

interface Props {
  lesson: Lesson | null;
  nextLesson: Lesson | null;
  score: number;
  total: number;
  xpGained: number;
  missedCount?: number;
}

export function LessonComplete({
  lesson,
  nextLesson,
  score,
  total,
  xpGained,
  missedCount = 0,
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
          {perfectFirstTry ? "Perfect lesson!" : "Step complete"}
        </h1>
        <p className="text-sm text-stone-500">{lesson?.title}</p>
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
          +{xpGained} XP
        </Badge>
      </InkPanel>

      <div className="flex flex-col gap-2">
        {nextLesson && (
          <Link href={`/lesson/${nextLesson.id}`}>
            <Button size="lg" className="w-full">
              Next: {nextLesson.title}
            </Button>
          </Link>
        )}
        <Link href="/dashboard">
          <Button variant="secondary" size="lg" className="w-full">
            Back to trail
          </Button>
        </Link>
      </div>
    </div>
  );
}
