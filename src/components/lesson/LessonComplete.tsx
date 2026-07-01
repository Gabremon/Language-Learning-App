"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLessonById, getNextLesson } from "@/data/seed";
import Link from "next/link";
import { Star, Trophy } from "lucide-react";

interface Props {
  lessonId: string;
  score: number;
  total: number;
  xpGained: number;
}

export function LessonComplete({ lessonId, score, total, xpGained }: Props) {
  const lesson = getLessonById(lessonId);
  const nextLesson = getNextLesson(lessonId);
  const pct = Math.round((score / total) * 100);

  return (
    <div className="animate-bounce-in mx-auto max-w-lg space-y-6 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent-100">
        <Trophy className="h-12 w-12 text-accent-500" />
      </div>
      <h1 className="text-3xl font-bold text-brand-800">Lesson Complete!</h1>
      <p className="text-gray-600">{lesson?.title}</p>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={`h-10 w-10 ${i < Math.ceil(pct / 34) ? "fill-accent-400 text-accent-400" : "text-gray-200"}`}
              />
            ))}
          </div>
          <p className="text-4xl font-bold text-brand-700">{score}/{total}</p>
          <p className="text-gray-600">{pct}% correct</p>
          <Badge variant="accent" className="text-base px-4 py-2">+{xpGained} XP</Badge>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {nextLesson && (
          <Link href={`/lesson/${nextLesson.id}`}>
            <Button size="lg" className="w-full">Continue to next lesson</Button>
          </Link>
        )}
        <Link href="/dashboard">
          <Button variant="secondary" size="lg" className="w-full">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
