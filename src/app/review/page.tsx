"use client";

import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExerciseFeedback } from "@/components/exercises/ExerciseFeedback";
import { vocabItems } from "@/data/seed";
import {
  loadProgress,
  saveProgress,
  getVocabMemory,
  setVocabMemory,
  addXp,
  updateStreak,
} from "@/lib/progress";
import { isDueForReview, updateVocabMemoryOnReview } from "@/lib/srs";
import { normalizeEnglishAnswer } from "@/lib/exercise-checker";
import { speakMandarin } from "@/lib/speech";
import { Input } from "@/components/ui/input";
import { Volume2 } from "lucide-react";
import Link from "next/link";

interface ReviewItem {
  vocabId: string;
  hanzi: string;
  pinyin: string;
  english: string;
}

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const progress = loadProgress();
    const due = vocabItems
      .map((v) => {
        const memory = getVocabMemory(progress, v.id);
        return { vocab: v, memory };
      })
      .filter(({ memory }) => isDueForReview(memory) || memory.timesSeen === 0)
      .slice(0, 10)
      .map(({ vocab }) => ({
        vocabId: vocab.id,
        hanzi: vocab.hanzi,
        pinyin: vocab.pinyin,
        english: vocab.english.split("/")[0].trim(),
      }));

    setItems(due.length > 0 ? due : vocabItems.slice(0, 5).map((v) => ({
      vocabId: v.id,
      hanzi: v.hanzi,
      pinyin: v.pinyin,
      english: v.english.split("/")[0].trim(),
    })));
    setLoading(false);
  }, []);

  const current = items[currentIndex];

  const handleCheck = useCallback(() => {
    if (!current) return;
    const isCorrect =
      normalizeEnglishAnswer(answer) === normalizeEnglishAnswer(current.english);

    setResult({ isCorrect, correctAnswer: current.english });
    if (isCorrect) setScore((s) => s + 1);

    let progress = loadProgress();
    const memory = getVocabMemory(progress, current.vocabId);
    progress = setVocabMemory(
      progress,
      updateVocabMemoryOnReview(memory, isCorrect)
    );
    if (isCorrect) {
      progress = addXp(updateStreak(progress), 5);
    }
    saveProgress(progress);
  }, [answer, current]);

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
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Loading review...</p>
        </div>
      </AppShell>
    );
  }

  if (items.length === 0) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-2xl font-bold text-brand-800">All caught up!</p>
          <p className="text-gray-500">No words due for review right now. Complete more lessons to build your vocabulary.</p>
          <Link href="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  if (done) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-3xl font-bold text-brand-800">Review complete!</p>
          <p className="text-gray-600">You got {score}/{items.length} correct</p>
          <Link href="/dashboard">
            <Button size="lg">Continue learning</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Review</h1>
          <p className="text-gray-500">Strengthen your vocabulary with spaced repetition</p>
        </div>

        <Progress value={((currentIndex + (result ? 1 : 0)) / items.length) * 100} />

        <Card>
          <CardContent className="space-y-6 pt-6">
            <p className="text-sm font-semibold uppercase text-brand-500">What does this mean?</p>
            <div className="text-center">
              <p className="text-6xl font-bold text-brand-800">{current.hanzi}</p>
              <button
                onClick={() => speakMandarin(current.hanzi)}
                className="mt-3 inline-flex items-center gap-2 text-brand-500 hover:text-brand-600"
              >
                <Volume2 className="h-5 w-5" /> Listen
              </button>
            </div>
            <Input
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
              autoFocus
            />
            {result && (
              <ExerciseFeedback
                isCorrect={result.isCorrect}
                correctAnswer={result.correctAnswer}
                explanation={`${current.hanzi} (${current.pinyin})`}
              />
            )}
            <div className="flex justify-end">
              {!result ? (
                <Button onClick={handleCheck} disabled={!answer.trim()} size="lg">Check</Button>
              ) : (
                <Button onClick={handleContinue} size="lg" variant={result.isCorrect ? "success" : "default"}>
                  Continue
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-400">
          {currentIndex + 1} of {items.length}
        </p>
      </div>
    </AppShell>
  );
}
