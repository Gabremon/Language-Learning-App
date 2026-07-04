"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { InkPageHeader, InkPanel, InkProgress } from "@/components/ui/ink-shell";
import { Button } from "@/components/ui/button";
import { ExerciseFeedback } from "@/components/exercises/ExerciseFeedback";
import { getVocabMemory } from "@/lib/progress";
import { buildReviewQueue, type PracticeVocabContext } from "@/lib/practice-vocab";
import { lessonVocabMap } from "@/lib/lesson-vocab-map";
import { updateVocabMemoryOnReview } from "@/lib/srs";
import { matchesEnglishAnswer } from "@/lib/exercise-checker";
import { speakMandarin } from "@/lib/speech";
import { AuthProgressPrompt } from "@/components/errors/AuthProgressPrompt";
import { PageLoadingShell } from "@/components/ui/PageLoadingShell";
import { PinyinDisplay } from "@/components/ui/PinyinDisplay";
import { useProgress } from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import { AutoFocusInput } from "@/components/ui/AutoFocusInput";
import { Volume2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewItem {
  vocabId: string;
  hanzi: string;
  pinyin: string;
  english: string;
}

interface ReviewSessionResult extends ReviewItem {
  isCorrect: boolean;
  userAnswer: string;
}

interface Props {
  vocabItems: PracticeVocabContext["vocabItems"];
  lessons: PracticeVocabContext["lessons"];
  units: PracticeVocabContext["units"];
}

export function ReviewView({ vocabItems, lessons, units }: Props) {
  const { progress, loading, error, retryLoad, applyReviewUpdate } = useProgress();
  const { recordReviewCorrect } = useGamification();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionResults, setSessionResults] = useState<ReviewSessionResult[]>([]);
  const [itemsReady, setItemsReady] = useState(false);

  useEffect(() => {
    if (!progress) return;

    const practiceContext = { vocabItems, lessons, units, lessonVocabMap };
    const queue = buildReviewQueue(progress, practiceContext);

    setItems(
      queue.map((vocab) => ({
        vocabId: vocab.id,
        hanzi: vocab.hanzi,
        pinyin: vocab.pinyin,
        english: vocab.english,
      }))
    );
    setItemsReady(true);
  }, [progress, vocabItems, lessons, units]);

  const current = items[currentIndex];

  const handleCheck = useCallback(async () => {
    if (!current || !progress) return;
    const isCorrect = matchesEnglishAnswer(answer, [current.english]);

    setResult({ isCorrect, correctAnswer: current.english });
    if (isCorrect) setScore((s) => s + 1);
    setSessionResults((prev) => [
      ...prev,
      {
        ...current,
        isCorrect,
        userAnswer: answer.trim(),
      },
    ]);

    const memory = getVocabMemory(progress, current.vocabId);
    const updated = updateVocabMemoryOnReview(memory, isCorrect);
    await applyReviewUpdate(current.vocabId, updated, isCorrect ? 5 : 0);
    if (isCorrect) await recordReviewCorrect();
  }, [answer, current, progress, applyReviewUpdate, recordReviewCorrect]);

  const handleContinue = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswer("");
      setResult(null);
    } else {
      setDone(true);
    }
  }, [currentIndex, items.length]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter") return;
      if (result) {
        e.preventDefault();
        handleContinue();
      } else if (answer.trim()) {
        e.preventDefault();
        handleCheck();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [result, answer, handleCheck, handleContinue]);

  if (loading) {
    return (
      <PageLoadingShell
        glyph="复"
        title="Checking what words are due…"
        subtitle="Loading your spaced review queue"
      />
    );
  }

  if (!progress) {
    return (
      <AppShell>
        <AuthProgressPrompt error={error} onRetry={retryLoad} />
      </AppShell>
    );
  }

  if (!itemsReady) {
    return (
      <PageLoadingShell
        glyph="复"
        title="Preparing review…"
        subtitle="Sorting words by what needs practice most"
      />
    );
  }

  if (items.length === 0) {
    return (
      <AppShell>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-emerald-300 bg-emerald-50 text-xl font-bold text-emerald-600">
            复
          </div>
          <p className="text-xl font-bold text-stone-800">Nothing due right now</p>
          <p className="max-w-xs text-sm text-stone-500">
            Complete more lessons to add words here — review uses vocabulary from lessons
            you&apos;ve finished.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/course">
              <Button>Continue the trail</Button>
            </Link>
            <Link href="/word-sprint">
              <Button variant="secondary">Word sprint</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (done) {
    return (
      <AppShell>
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border-2 border-amber-300 bg-amber-50 text-2xl font-bold text-amber-600">
              成
            </div>
            <p className="mt-4 text-2xl font-bold text-stone-800">Review complete</p>
            <p className="mt-1 text-stone-600">
              {score}/{items.length} correct
            </p>
          </div>

          <InkPanel className="p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Words you reviewed
            </p>
            <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
              {sessionResults.map((item) => (
                <li
                  key={item.vocabId}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-3 py-2.5",
                    item.isCorrect
                      ? "border-emerald-100 bg-emerald-50/60"
                      : "border-red-100 bg-red-50/60"
                  )}
                >
                  {item.isCorrect ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-stone-800">{item.hanzi}</p>
                      <button
                        type="button"
                        onClick={() => speakMandarin(item.hanzi)}
                        className="text-brand-600 hover:text-brand-700"
                        aria-label={`Listen to ${item.hanzi}`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <PinyinDisplay pinyin={item.pinyin} size="sm" className="mt-0.5" />
                    <p className="mt-1 text-sm font-medium text-stone-700">{item.english}</p>
                    {!item.isCorrect && item.userAnswer && (
                      <p className="mt-1 text-xs text-red-600">You typed: {item.userAnswer}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </InkPanel>

          <Link href="/dashboard">
            <Button size="lg" className="w-full">
              Continue learning
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const progressValue = ((currentIndex + (result ? 1 : 0)) / items.length) * 100;

  return (
    <AppShell>
      <div className="space-y-4">
        <InkPageHeader
          eyebrow="复 · Spaced review"
          title="Word recall"
          subtitle="Type the English meaning from memory"
          glyph="复"
        />

        <InkProgress value={progressValue} />

        <InkPanel>
          <div className="space-y-5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
              What does this mean?
            </p>
            <div className="text-center">
              <p className="text-5xl font-bold text-stone-800">{current.hanzi}</p>
              <button
                onClick={() => speakMandarin(current.hanzi)}
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700"
              >
                <Volume2 className="h-4 w-4" /> Listen
              </button>
            </div>
            <AutoFocusInput
              focusKey={currentIndex}
              placeholder="Type the English meaning..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                if (result) handleContinue();
                else if (answer.trim()) handleCheck();
              }}
              disabled={!!result}
              className="border-stone-200 bg-white/80"
            />
            {result && (
              <>
                <ExerciseFeedback
                  isCorrect={result.isCorrect}
                  correctAnswer={result.correctAnswer}
                  explanation={current.english}
                />
                <div className="flex justify-center">
                  <PinyinDisplay pinyin={current.pinyin} size="sm" />
                </div>
              </>
            )}
            <div className="flex justify-end">
              {!result ? (
                <Button onClick={handleCheck} disabled={!answer.trim()}>
                  Check
                </Button>
              ) : (
                <Button onClick={handleContinue} variant={result.isCorrect ? "success" : "default"}>
                  Continue
                </Button>
              )}
            </div>
          </div>
        </InkPanel>

        <p className="text-center text-xs text-stone-400">
          {currentIndex + 1} of {items.length}
        </p>
      </div>
    </AppShell>
  );
}
