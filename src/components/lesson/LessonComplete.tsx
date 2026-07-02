"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@/types/course";
import Link from "next/link";
import { Star, Trophy, Sparkles } from "lucide-react";

interface Props {
  lesson: Lesson | null;
  nextLesson: Lesson | null;
  score: number;
  total: number;
  xpGained: number;
}

export function LessonComplete({ lesson, nextLesson, score, total, xpGained }: Props) {
  const pct = Math.round((score / total) * 100);
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;

  return (
    <div className="animate-bounce-in mx-auto max-w-lg space-y-6 text-center">
      <div className="relative mx-auto">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
          <Trophy className="h-14 w-14 text-white" />
        </div>
        <Sparkles className="absolute -right-2 top-0 h-8 w-8 text-amber-400 animate-pulse" />
        <Sparkles className="absolute -left-2 bottom-2 h-6 w-6 text-violet-400 animate-pulse" />
      </div>
      <h1 className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">
        Lesson Complete!
      </h1>
      <p className="text-lg text-gray-600">{lesson?.title}</p>

      <Card className="overflow-hidden border-0 shadow-xl ring-2 ring-amber-100">
        <CardContent className="space-y-4 bg-gradient-to-b from-amber-50 to-white pt-8 pb-6">
          <div className="flex justify-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={`h-12 w-12 transition-all ${
                  i < stars
                    ? "fill-amber-400 text-amber-400 drop-shadow-md scale-110"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-5xl font-bold text-brand-700">{score}/{total}</p>
          <p className="text-gray-600">{pct}% correct</p>
          <Badge variant="accent" className="px-6 py-2 text-lg font-bold">
            +{xpGained} XP
          </Badge>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {nextLesson && (
          <Link href={`/lesson/${nextLesson.id}`}>
            <Button size="lg" className="w-full shadow-md">
              Continue to: {nextLesson.title}
            </Button>
          </Link>
        )}
        <Link href="/dashboard">
          <Button variant="secondary" size="lg" className="w-full">
            Back to dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
