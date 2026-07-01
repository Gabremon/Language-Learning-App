"use client";

import { Button } from "@/components/ui/button";
import type { ReversePinyinPayload } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface Props {
  payload: ReversePinyinPayload;
  selected: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export function ReversePinyinExercise({ payload, selected, onSelect, disabled }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-center text-4xl font-bold text-brand-600">{payload.pinyin}</p>
      <p className="text-center text-gray-600">Which hanzi matches this pronunciation?</p>
      <div className="grid grid-cols-2 gap-3">
        {payload.options.map((option, index) => (
          <Button
            key={`${index}-${option}`}
            variant={selected === option ? "default" : "secondary"}
            className={cn("text-3xl h-20", disabled && "pointer-events-none")}
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
