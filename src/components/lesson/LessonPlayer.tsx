"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import { ExerciseFeedback } from "@/components/exercises/ExerciseFeedback";
import { LessonComplete } from "@/components/lesson/LessonComplete";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { getExercisesForLesson, getLessonById, getVocabForLesson } from "@/data/seed";
import { checkExerciseAnswer } from "@/lib/exercise-checker";
import {
  completeLesson,
  getVocabMemory,
  loadProgress,
  saveProgress,
  setVocabMemory,
} from "@/lib/progress";
import { updateVocabMemoryOnReview } from "@/lib/srs";
import type { ExerciseResult, UserAnswer } from "@/types/exercises";
import { isMatchPairs, isEnglishToHanziWordBank } from "@/types/exercises";
import { X } from "lucide-react";
import Link from "next/link";

interface Props {
  lessonId: string;
}

function isAnswerReady(
  exercise: ReturnType<typeof getExercisesForLesson>[0],
  answer: UserAnswer | null
): boolean {
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

export function LessonPlayer({ lessonId }: Props) {
  const router = useRouter();
  const lesson = getLessonById(lessonId);
  const exerciseList = getExercisesForLesson(lessonId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<UserAnswer | null>(null);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [ready, setReady] = useState(false);

  const exercise = exerciseList[currentIndex];

  useEffect(() => {
    setReady(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!exercise || answer === null) return;
    const checkResult = checkExerciseAnswer(exercise, answer);
    setResult(checkResult);
    if (checkResult.isCorrect) setScore((s) => s + 1);

    let progress = loadProgress();
    const lessonVocab = getVocabForLesson(lessonId);
    lessonVocab.forEach((v) => {
      const memory = getVocabMemory(progress, v.id);
      progress = setVocabMemory(
        progress,
        updateVocabMemoryOnReview(memory, checkResult.isCorrect)
      );
    });
    saveProgress(progress);
  }, [exercise, answer, lessonId]);

  const handleContinue = useCallback(() => {
    if (currentIndex < exerciseList.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswer(null);
      setResult(null);
      return;
    }

    const progress = loadProgress();
    const xp = score * 10 + (score === exerciseList.length ? 20 : 0);
    saveProgress(completeLesson(progress, lessonId, score, exerciseList.length));
    setXpGained(xp);
    setIsComplete(true);
  }, [currentIndex, exerciseList.length, lessonId, score]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter") return;
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
  }, [result, exercise, answer, handleSubmit, handleContinue]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson || exerciseList.length === 0) {
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
        lessonId={lessonId}
        score={score}
        total={exerciseList.length}
        xpGained={xpGained}
      />
    );
  }

  const canSubmit = isAnswerReady(exercise, answer);
  const progressValue = ((currentIndex + (result ? 1 : 0)) / exerciseList.length) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </Link>
        <Progress value={progressValue} className="flex-1" />
        <span className="text-sm font-medium text-gray-500">
          {currentIndex + 1}/{exerciseList.length}
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
                variant={result.isCorrect ? "success" : "default"}
              >
                Continue
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
