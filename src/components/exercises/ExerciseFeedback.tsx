"use client";

import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { speakMandarin } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface ExerciseFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  /** Mandarin to read aloud when feedback appears (correct or incorrect). */
  speakText?: string | null;
}

export function ExerciseFeedback({
  isCorrect,
  correctAnswer,
  explanation,
  speakText,
}: ExerciseFeedbackProps) {
  useEffect(() => {
    const text = speakText?.trim();
    if (!text) return;
    speakMandarin(text);
  }, [speakText]);

  const hanzi = speakText?.trim();

  return (
    <div
      className={cn(
        "animate-slide-up rounded-2xl border-2 p-4",
        isCorrect ? "border-success bg-green-50" : "border-error bg-red-50"
      )}
    >
      <p className={cn("text-lg font-bold", isCorrect ? "text-green-700" : "text-red-700")}>
        {isCorrect ? "Correct!" : "Not quite"}
      </p>
      {!isCorrect && (
        <p className="mt-1 text-gray-700">
          Correct answer: <span className="font-semibold">{correctAnswer}</span>
        </p>
      )}
      {hanzi && (
        <div className="mt-2 flex items-center gap-2">
          <p className="text-xl font-bold text-brand-800">{hanzi}</p>
          <button
            type="button"
            onClick={() => speakMandarin(hanzi)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
            aria-label="Listen to pronunciation"
          >
            <Volume2 className="h-4 w-4" />
            Listen
          </button>
        </div>
      )}
      {explanation && <p className="mt-2 text-sm text-gray-600">{explanation}</p>}
    </div>
  );
}
