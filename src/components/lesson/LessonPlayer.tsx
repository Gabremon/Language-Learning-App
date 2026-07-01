"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import { ExerciseFeedback } from "@/components/exercises/ExerciseFeedback";
import { LessonComplete } from "@/components/lesson/LessonComplete";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { checkExerciseAnswer } from "@/lib/exercise-checker";
import { getVocabMemory, setVocabMemory } from "@/lib/progress";
import { updateVocabMemoryOnReview } from "@/lib/srs";
import { useProgress } from "@/contexts/ProgressContext";
import type { Lesson, VocabItem } from "@/types/course";
import type { BaseExercise, ExerciseResult, UserAnswer } from "@/types/exercises";
import { isMatchPairs, isEnglishToHanziWordBank } from "@/types/exercises";
import { X } from "lucide-react";
import Link from "next/link";

interface Props {
  lesson: Lesson | null;
  exercises: BaseExercise[];
  lessonVocab: VocabItem[];
  nextLesson: Lesson | null;
}

function isAnswerReady(exercise: BaseExercise, answer: UserAnswer | null): boolean {
  if (answer === null) return false;
  if (isMatchPairs(exercise)) {
    const matches = answer as Record<string, string>;
    return Object.keys(matches).length === exercise.payload.pairs.length;
  }
  if (isEnglishToHanziWordBank(exercise)) {
    return (answer as string[]).length === exercise.payload.correctAnswer.length;
  }
  if (typeof answer === "string") return answer.trim().length > 0;
  return true;
}

export function LessonPlayer({ lesson, exercises, lessonVocab, nextLesson }: Props) {
  const router = useRouter();
  const { progress, loading, updateVocabMemories, completeLesson } = useProgress();
  const lessonId = lesson?.id ?? "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<UserAnswer | null>(null);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [saving, setSaving] = useState(false);

  const exercise = exercises[currentIndex];

  const handleSubmit = useCallback(async () => {
    if (!exercise || answer === null || !progress) return;
    const checkResult = checkExerciseAnswer(exercise, answer);
    setResult(checkResult);
    if (checkResult.isCorrect) setScore((s) => s + 1);

    const updatedMemories = lessonVocab.map((v) => {
      const memory = getVocabMemory(progress, v.id);
      return updateVocabMemoryOnReview(memory, checkResult.isCorrect);
    });
    await updateVocabMemories(updatedMemories);
  }, [exercise, answer, lessonVocab, progress, updateVocabMemories]);

  const handleContinue = useCallback(async () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswer(null);
      setResult(null);
      return;
    }

    setSaving(true);
    try {
      const { xpGained: xp } = await completeLesson(lessonId, score, exercises.length);
      setXpGained(xp);
      setIsComplete(true);
    } finally {
      setSaving(false);
    }
  }, [currentIndex, exercises.length, lessonId, score, completeLesson]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter" || saving) return;
      if (result) {
        e.preventDefault();
        handleContinue();
      } else if (exercise && isAnswerReady(exercise, answer)) {
        e.preventDefault();
        handleSubmit();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [result, exercise, answer, handleSubmit, handleContinue, saving]);

  if (loading || !progress) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson || exercises.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Lesson not found or has no exercises.</p>
        <Button onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <LessonComplete
        lesson={lesson}
        nextLesson={nextLesson}
        score={score}
        total={exercises.length}
        xpGained={xpGained}
      />
    );
  }

  const canSubmit = exercise ? isAnswerReady(exercise, answer) : false;
  const progressValue = ((currentIndex + (result ? 1 : 0)) / exercises.length) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </Link>
        <Progress value={progressValue} className="flex-1" />
        <span className="text-sm font-medium text-gray-500">
          {currentIndex + 1}/{exercises.length}
        </span>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            {exercise.prompt}
          </p>

          <ExerciseRenderer
            exercise={exercise}
            answer={answer}
            onAnswerChange={setAnswer}
            disabled={!!result}
          />

          {result && (
            <ExerciseFeedback
              isCorrect={result.isCorrect}
              correctAnswer={result.correctAnswer}
              explanation={result.explanation}
            />
          )}

          <div className="flex justify-end">
            {!result ? (
              <Button onClick={handleSubmit} disabled={!canSubmit} size="lg">
                Check
              </Button>
            ) : (
              <Button
                onClick={handleContinue}
                size="lg"
                disabled={saving}
                variant={result.isCorrect ? "success" : "default"}
              >
                {saving ? "Saving..." : "Continue"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
