"use client";

import { Button } from "@/components/ui/button";
import type { FillInBlankPayload } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface Props {
  payload: FillInBlankPayload;
  selected: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export function FillInBlankExercise({ payload, selected, onSelect, disabled }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-center text-3xl font-bold text-brand-800">{payload.sentence}</p>
      {payload.fullPinyin && (
        <p className="text-center text-brand-500">{payload.fullPinyin}</p>
      )}
      {payload.options && (
        <div className="grid grid-cols-2 gap-3">
          {payload.options.map((option) => (
            <Button
              key={option}
              variant={selected === option ? "default" : "secondary"}
              className={cn("text-2xl h-16", disabled && "pointer-events-none")}
              onClick={() => onSelect(option)}
              disabled={disabled}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
