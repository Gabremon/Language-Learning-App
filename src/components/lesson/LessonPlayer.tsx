"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import { ExerciseFeedback } from "@/components/exercises/ExerciseFeedback";
import { LessonComplete } from "@/components/lesson/LessonComplete";
import { LessonPhaseBar } from "@/components/lesson/LessonPhaseBar";
import { MissedConceptsPanel } from "@/components/lesson/MissedConceptsPanel";
import { AuthProgressPrompt } from "@/components/errors/AuthProgressPrompt";
import { PageLoadingShell } from "@/components/ui/PageLoadingShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { checkExerciseAnswer } from "@/lib/exercise-checker";
import { getRelatedVocab, recordMiss, type MissedExerciseRecord } from "@/lib/exercise-vocab";
import { getSpeakableHanzi } from "@/lib/exercise-speech";
import { getLessonDisplayTitle } from "@/lib/lesson-titles";
import { getVocabMemory } from "@/lib/progress";
import { loadGuestProgress } from "@/lib/guest-progress";
import { updateVocabMemoryOnReview } from "@/lib/srs";
import { useProgress } from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import {
  FIRST_SESSION_EXERCISE_CAP,
  isFirstSessionMode,
} from "@/lib/demo";
import { shuffleLessonExercises } from "@/lib/shuffle-lesson-exercises";
import type { Lesson, VocabItem } from "@/types/course";
import type { BaseExercise, ExerciseResult, UserAnswer } from "@/types/exercises";
import { isEnglishToHanziWordBank, isMatchPairs, isToneAndEnglish } from "@/types/exercises";
import { X, RotateCcw } from "lucide-react";
import Link from "next/link";

interface Props {
  lesson: Lesson | null;
  exercises: BaseExercise[];
  lessonVocab: VocabItem[];
  nextLesson: Lesson | null;
  allowGuest?: boolean;
}

type LessonPhase = "main" | "review" | "concepts";

function isAnswerReady(exercise: BaseExercise, answer: UserAnswer | null): boolean {
  if (answer === null) return false;
  if (isMatchPairs(exercise)) {
    const matches = answer as Record<string, string>;
    return Object.keys(matches).length === exercise.payload.pairs.length;
  }
  if (isEnglishToHanziWordBank(exercise)) {
    return (answer as string[]).length === exercise.payload.correctAnswer.length;
  }
  if (isToneAndEnglish(exercise)) {
    const typed = answer as { tone?: string; english?: string };
    return Boolean(typed.tone && typed.english?.trim());
  }
  if (typeof answer === "string") return answer.trim().length > 0;
  return true;
}

export function LessonPlayer({
  lesson,
  exercises: allExercises,
  lessonVocab,
  nextLesson,
  allowGuest = false,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { progress, loading, isGuest, updateVocabMemories, completeLesson } = useProgress();
  const { recordLessonComplete } = useGamification();
  const lessonId = lesson?.id ?? "";
  const firstSession = isFirstSessionMode(lessonId, { mode: searchParams.get("mode") });
  const exitHref = isGuest ? "/" : "/dashboard";
  const activeProgress = progress ?? (allowGuest ? loadGuestProgress() : null);

  const shuffleSeed = useMemo(
    () => `${lessonId}-${Math.random().toString(36).slice(2, 11)}`,
    [lessonId]
  );

  const exercises = useMemo(() => {
    let base = allExercises;
    if (firstSession) {
      const listening = base.filter((e) => e.type === "listening");
      const rest = base.filter((e) => e.type !== "listening");
      const picked = [...listening.slice(0, 2), ...rest].slice(0, FIRST_SESSION_EXERCISE_CAP);
      base = picked.length > 0 ? picked : base.slice(0, FIRST_SESSION_EXERCISE_CAP);
    }
    return shuffleLessonExercises(base, shuffleSeed);
  }, [allExercises, firstSession, shuffleSeed]);

  const [phase, setPhase] = useState<LessonPhase>("main");
  const [index, setIndex] = useState(0);
  const [reviewQueue, setReviewQueue] = useState<BaseExercise[]>([]);
  const [answer, setAnswer] = useState<UserAnswer | null>(null);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [firstTrySeen, setFirstTrySeen] = useState<Set<string>>(new Set());
  const [missedLog, setMissedLog] = useState<MissedExerciseRecord[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const activeExercises = phase === "main" ? exercises : phase === "review" ? reviewQueue : [];
  const exercise = activeExercises[index];

  const struggledVocab = useMemo(
    () =>
      Array.from(
        new Map(
          missedLog.flatMap((m) => getRelatedVocab(m.exercise, lessonVocab).map((v) => [v.id, v]))
        ).values()
      ),
    [missedLog, lessonVocab]
  );

  const resetQuestion = useCallback(() => {
    setAnswer(null);
    setResult(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!exercise || answer === null || !activeProgress) return;
    const checkResult = checkExerciseAnswer(exercise, answer);
    setResult(checkResult);

    const isFirstTry = !firstTrySeen.has(exercise.id);
    if (isFirstTry) {
      setFirstTrySeen((prev) => new Set(prev).add(exercise.id));
      if (checkResult.isCorrect) setFirstTryCorrect((s) => s + 1);
    }

    const related = getRelatedVocab(exercise, lessonVocab);
    const memories = related.map((v) => {
      const memory = getVocabMemory(activeProgress, v.id);
      return updateVocabMemoryOnReview(memory, checkResult.isCorrect);
    });
    await updateVocabMemories(memories);

    if (!checkResult.isCorrect) {
      setMissedLog((log) =>
        recordMiss(log, exercise, checkResult.correctAnswer, checkResult.explanation)
      );
      if (phase === "main" && !reviewQueue.some((e) => e.id === exercise.id)) {
        setReviewQueue((q) => [...q, exercise]);
      }
    }
  }, [
    exercise,
    answer,
    activeProgress,
    lessonVocab,
    firstTrySeen,
    phase,
    reviewQueue,
    updateVocabMemories,
  ]);

  const finishLesson = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const result = await completeLesson(
        lessonId,
        firstTryCorrect,
        exercises.length,
        nextLesson?.id
      );
      await recordLessonComplete(firstTryCorrect, exercises.length, result.progress);
      setXpGained(result.xpGained);
      setIsComplete(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save lesson";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  }, [completeLesson, lessonId, firstTryCorrect, exercises.length, nextLesson?.id, recordLessonComplete]);

  const handleContinue = useCallback(async () => {
    if (!result) return;

    if (index < activeExercises.length - 1) {
      setIndex((i) => i + 1);
      resetQuestion();
      return;
    }

    if (phase === "main" && reviewQueue.length > 0 && !firstSession) {
      setPhase("review");
      setIndex(0);
      setReviewQueue((queue) => shuffleLessonExercises(queue, `${shuffleSeed}:review`));
      resetQuestion();
      return;
    }

    if (struggledVocab.length > 0 && !firstSession) {
      setPhase("concepts");
      resetQuestion();
      return;
    }

    await finishLesson();
  }, [
    result,
    index,
    activeExercises.length,
    phase,
    reviewQueue.length,
    struggledVocab.length,
    firstSession,
    resetQuestion,
    finishLesson,
    shuffleSeed,
  ]);

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

  const canPlay = Boolean(activeProgress) && (allowGuest || !loading);

  if (!allowGuest && loading) {
    return (
      <PageLoadingShell
        glyph="课"
        title="Loading your lesson…"
        subtitle="Preparing exercises and your progress"
        variant="paper"
        className="min-h-[50vh]"
      />
    );
  }

  if (!canPlay) {
    return (
      <AuthProgressPrompt
        compact
        message="We couldn't load your lesson progress. Try the demo or sign in to continue."
      />
    );
  }

  if (!lesson || exercises.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Lesson not found or has no exercises.</p>
        <Button onClick={() => router.push(exitHref)}>Go back</Button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <LessonComplete
        lesson={lesson}
        nextLesson={isGuest ? null : nextLesson}
        score={firstTryCorrect}
        total={exercises.length}
        xpGained={xpGained}
        missedCount={missedLog.length}
        isGuest={isGuest}
        isFirstSession={firstSession}
        streakCount={activeProgress?.streakCount ?? 0}
      />
    );
  }

  if (phase === "concepts") {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Lesson wrap-up</p>
          <h2 className="text-xl font-bold text-stone-800">Review what you missed</h2>
          <p className="mt-1 text-sm text-stone-500">
            Study these concepts before you finish {getLessonDisplayTitle(lesson)}
          </p>
        </div>

        <MissedConceptsPanel vocab={struggledVocab} />

        <Button size="lg" className="w-full" disabled={saving} onClick={() => finishLesson()}>
          {saving ? "Saving..." : isGuest ? "Finish demo" : "Finish lesson"}
        </Button>
        {saveError && (
          <p className="text-center text-sm text-red-600">{saveError}</p>
        )}
      </div>
    );
  }

  const canSubmit = exercise ? isAnswerReady(exercise, answer) : false;
  const totalSteps = exercises.length + (reviewQueue.length > 0 ? reviewQueue.length : 0);
  const completedSteps =
    (phase === "main" ? index : exercises.length + index) + (result ? 1 : 0);
  const progressValue = (completedSteps / totalSteps) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {isGuest && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-center text-sm text-brand-800">
          Demo mode —{" "}
          <Link href="/auth" className="font-semibold underline hover:text-brand-900">
            sign in to save progress
          </Link>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link
          href={exitHref}
          className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </Link>
        <Progress value={progressValue} className="h-3 flex-1" />
        <span className="text-sm font-bold text-brand-600">
          {phase === "review" ? "Review" : `${index + 1}/${exercises.length}`}
        </span>
      </div>

      {phase === "review" && (
        <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2">
          <RotateCcw className="h-4 w-4 text-violet-600" />
          <p className="text-sm font-semibold text-violet-800">
            Review round — try the ones you missed
          </p>
          <Badge variant="muted" className="ml-auto">
            {index + 1}/{reviewQueue.length}
          </Badge>
        </div>
      )}

      <LessonPhaseBar exercise={exercise} />

      <Card className="overflow-hidden border-stone-200/70 bg-white/90 shadow-md">
        <CardContent className="space-y-6 p-5">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-brand-600">
            {exercise.prompt}
          </p>

          <ExerciseRenderer
            key={exercise.id}
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
              speakText={getSpeakableHanzi(exercise)}
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
                {saving
                  ? "Saving..."
                  : phase === "review" && index === reviewQueue.length - 1
                    ? "Finish lesson"
                    : "Continue"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && !result.isCorrect && phase === "main" && !firstSession && (
        <p className="text-center text-xs text-stone-500">
          You&apos;ll see this again at the end of the lesson.
        </p>
      )}
      {missedLog.length > 0 && !result && (
        <p className="text-center text-xs text-stone-400">
          {missedLog.reduce((n, m) => n + m.missCount, 0)} miss
          {missedLog.reduce((n, m) => n + m.missCount, 0) === 1 ? "" : "es"} this lesson — keep going!
        </p>
      )}
    </div>
  );
}
