"use client";

import { Button } from "@/components/ui/button";
import { VocabIllustration } from "@/components/ui/VocabIllustration";
import { PinyinDisplay } from "@/components/ui/PinyinDisplay";
import { AudioButton } from "@/components/ui/AudioButton";
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
    <div className="space-y-5 animate-fade-in">
      {(payload.displayHanzi || payload.imageUrl || payload.emoji) && (
        <div className="flex flex-col items-center gap-3">
          <VocabIllustration
            emoji={payload.emoji}
            imageUrl={payload.imageUrl}
            hanzi={payload.displayHanzi}
            size="lg"
          />
          {payload.displayHanzi && (
            <p className="text-5xl font-bold text-brand-800">{payload.displayHanzi}</p>
          )}
          {payload.pinyin && (
            <div className="flex items-center gap-2">
              <PinyinDisplay pinyin={payload.pinyin} size="lg" />
              <AudioButton text={payload.displayHanzi ?? payload.pinyin} size="sm" />
            </div>
          )}
        </div>
      )}
      <p className="text-center text-lg font-medium text-gray-700">{payload.question}</p>
      <div className="grid gap-3">
        {payload.options.map((option, index) => (
          <Button
            key={`${index}-${option}`}
            variant={selected === option ? "default" : "secondary"}
            className={cn(
              "w-full justify-start text-left h-auto py-4 text-base transition-all",
              selected === option && "ring-2 ring-brand-400 scale-[1.02]",
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
