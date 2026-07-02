"use client";

import { Button } from "@/components/ui/button";
import { VocabIllustration } from "@/components/ui/VocabIllustration";
import { AudioButton } from "@/components/ui/AudioButton";
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-center gap-3">
        <VocabIllustration
          emoji={payload.emoji}
          imageUrl={payload.imageUrl}
          hanzi={payload.hanzi}
          size="md"
        />
        <p className="text-center text-6xl font-bold text-brand-800">{payload.hanzi}</p>
        <AudioButton text={payload.hanzi} size="sm" />
      </div>
      <p className="text-center font-medium text-gray-600">Select the correct pinyin with tone marks</p>
      <div className="grid gap-3">
        {payload.options.map((option, index) => (
          <Button
            key={`${index}-${option}`}
            variant={selected === option ? "default" : "secondary"}
            className={cn(
              "w-full justify-start text-lg h-auto py-4 tracking-wide",
              selected === option && "ring-2 ring-sky-400",
              disabled && "pointer-events-none"
            )}
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
