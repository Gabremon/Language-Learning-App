"use client";

import { cn } from "@/lib/utils";

interface ExerciseFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
}

export function ExerciseFeedback({ isCorrect, correctAnswer, explanation }: ExerciseFeedbackProps) {
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
      {explanation && <p className="mt-2 text-sm text-gray-600">{explanation}</p>}
    </div>
  );
}
