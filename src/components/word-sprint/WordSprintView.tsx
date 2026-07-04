"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { InkPageHeader, InkPanel } from "@/components/ui/ink-shell";
import { Button } from "@/components/ui/button";
import { EnglishToHanziWordBankExercise } from "@/components/exercises/EnglishToHanziWordBankExercise";
import { AuthProgressPrompt } from "@/components/errors/AuthProgressPrompt";
import { PageLoadingShell } from "@/components/ui/PageLoadingShell";
import { useProgress } from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import { XP_VALUES } from "@/lib/gamification/xp";
import {
  buildWordSprintPayload,
  getWordSprintVocab,
  shuffleWordSprintQueue,
} from "@/lib/word-sprint";
import type { PracticeVocabContext } from "@/lib/practice-vocab";
import { lessonVocabMap } from "@/lib/lesson-vocab-map";
import type { VocabItem } from "@/types/course";
import type { EnglishToHanziWordBankPayload } from "@/types/exercises";
import { Timer, Trophy, Zap } from "lucide-react";

const SPRINT_SECONDS = 30;

interface Props {
  vocabItems: PracticeVocabContext["vocabItems"];
  lessons: PracticeVocabContext["lessons"];
  units: PracticeVocabContext["units"];
}

export function WordSprintView({ vocabItems, lessons, units }: Props) {
  const { progress, loading, error, retryLoad } = useProgress();
  const { state, recordGauntletRun } = useGamification();

  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SPRINT_SECONDS);
  const [queue, setQueue] = useState<VocabItem[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPayload, setCurrentPayload] = useState<EnglishToHanziWordBankPayload | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const practiceContext = useMemo(
    () => ({ vocabItems, lessons, units, lessonVocabMap }),
    [vocabItems, lessons, units]
  );

  const sprintWords = useMemo(
    () => (progress ? getWordSprintVocab(progress, practiceContext) : []),
    [progress, practiceContext]
  );

  const current = queue.length > 0 ? queue[wordIndex % queue.length] : undefined;

  useEffect(() => {
    if (!current) {
      setCurrentPayload(null);
      return;
    }
    setCurrentPayload(buildWordSprintPayload(current, sprintWords));
    setSelected([]);
  }, [current?.id, sprintWords]);

  const endRun = useCallback(
    async (finalScore: number, finalCombo: number) => {
      const xp =
        finalScore * XP_VALUES.gauntletPerWord +
        Math.floor(finalCombo / 3) * XP_VALUES.gauntletComboBonus;
      setXpEarned(xp);
      setFinished(true);
      await recordGauntletRun(finalScore, xp);
    },
    [recordGauntletRun]
  );

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      endRun(score, combo);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [started, finished, timeLeft, score, combo, endRun]);

  const handleSelect = useCallback(
    (chars: string[]) => {
      if (!currentPayload) {
        setSelected(chars);
        return;
      }

      if (chars.length < currentPayload.correctAnswer.length) {
        setSelected(chars);
        return;
      }

      const correct = chars.every((c, i) => c === currentPayload.correctAnswer[i]);
      if (correct) {
        setScore((s) => s + 1);
        setCombo((c) => c + 1);
        setSelected([]);
        setWordIndex((i) => i + 1);
      } else {
        setCombo(0);
        setSelected([]);
      }
    },
    [currentPayload]
  );

  function handleStart() {
    setQueue(shuffleWordSprintQueue(sprintWords));
    setStarted(true);
    setTimeLeft(SPRINT_SECONDS);
    setWordIndex(0);
    setScore(0);
    setCombo(0);
    setFinished(false);
    setXpEarned(0);
    setSelected([]);
  }

  if (loading) {
    return (
      <PageLoadingShell
        glyph="速"
        title="Loading word sprint…"
        subtitle="Gathering words you've already learned"
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

  if (!started) {
    const hasWords = sprintWords.length > 0;

    return (
      <AppShell>
        <div className="space-y-4">
          <InkPageHeader
            eyebrow="速 · Word sprint"
            title="30-second build challenge"
            subtitle="Build hanzi for words you've already met on the trail"
            glyph="速"
          />
          <InkPanel className="p-5 text-center">
            <Timer className="mx-auto h-10 w-10 text-brand-500" />
            {hasWords ? (
              <>
                <p className="mt-3 text-sm text-stone-600">
                  Tap characters to build words from lessons you&apos;ve reached on the trail.
                  Combo streaks earn bonus XP.
                </p>
                <p className="mt-2 text-xs font-medium text-brand-600">
                  {sprintWords.length} word{sprintWords.length === 1 ? "" : "s"} ready
                </p>
                {state.gauntletBestScore > 0 && (
                  <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-amber-600">
                    <Trophy className="h-4 w-4" /> Personal best: {state.gauntletBestScore} words
                  </p>
                )}
                <Button size="lg" className="mt-5 w-full" onClick={handleStart}>
                  Start sprint
                </Button>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm text-stone-600">
                  Keep going on the trail — word sprint unlocks vocabulary from lessons you&apos;ve
                  reached.
                </p>
                <Link href="/dashboard">
                  <Button size="lg" className="mt-5 w-full">
                    Go to trail
                  </Button>
                </Link>
              </>
            )}
          </InkPanel>
        </div>
      </AppShell>
    );
  }

  if (finished) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-amber-300 bg-amber-50 text-2xl font-bold text-amber-600">
            成
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Sprint complete!</h1>
          <p className="text-stone-600">{score} words built in {SPRINT_SECONDS} seconds</p>
          <p className="text-sm font-semibold text-brand-600">+{xpEarned} XP</p>
          {score >= state.gauntletBestScore && score > 0 && (
            <p className="text-xs text-amber-600">New personal best!</p>
          )}
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Button size="lg" onClick={handleStart}>
              Play again
            </Button>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="w-full">
                Back to trail
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold tabular-nums text-stone-800">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="text-brand-600">{score} words</span>
            {combo >= 2 && (
              <span className="flex items-center gap-1 text-amber-600">
                <Zap className="h-4 w-4" /> {combo}x combo
              </span>
            )}
          </div>
        </div>

        {currentPayload && current && (
          <InkPanel className="p-4">
            <EnglishToHanziWordBankExercise
              key={current.id}
              payload={currentPayload}
              selected={selected}
              onSelect={handleSelect}
            />
          </InkPanel>
        )}
      </div>
    </AppShell>
  );
}
