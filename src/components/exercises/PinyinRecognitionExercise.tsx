"use client";

import { Button } from "@/components/ui/button";
import type { PinyinRecognitionPayload } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface Props {
  payload: PinyinRecognitionPayload;
  selected: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export function PinyinRecognitionExercise({ payload, selected, onSelect, disabled }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-center text-6xl font-bold text-brand-800">{payload.hanzi}</p>
      <p className="text-center text-gray-600">Select the correct pinyin with tone marks</p>
      <div className="grid gap-3">
        {payload.options.map((option) => (
          <Button
            key={option}
            variant={selected === option ? "default" : "secondary"}
            className={cn("w-full justify-start text-lg h-auto py-4", disabled && "pointer-events-none")}
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
