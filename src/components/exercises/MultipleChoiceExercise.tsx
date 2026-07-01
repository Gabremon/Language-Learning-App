"use client";

import { Button } from "@/components/ui/button";
import type { MultipleChoicePayload } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface Props {
  payload: MultipleChoicePayload;
  selected: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export function MultipleChoiceExercise({ payload, selected, onSelect, disabled }: Props) {
  return (
    <div className="space-y-4">
      {payload.displayHanzi && (
        <p className="text-center text-5xl font-bold text-brand-800">{payload.displayHanzi}</p>
      )}
      <p className="text-center text-lg text-gray-700">{payload.question}</p>
      <div className="grid gap-3">
        {payload.options.map((option) => (
          <Button
            key={option}
            variant={selected === option ? "default" : "secondary"}
            className={cn("w-full justify-start text-left h-auto py-4", disabled && "pointer-events-none")}
            onClick={() => onSelect(option)}
            disabled={disabled}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
