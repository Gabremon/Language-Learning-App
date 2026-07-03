"use client";

import { Button } from "@/components/ui/button";
import { VocabIllustration } from "@/components/ui/VocabIllustration";
import { AudioButton } from "@/components/ui/AudioButton";
import { speakMandarin } from "@/lib/speech";
import type { ListeningPayload } from "@/types/exercises";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  payload: ListeningPayload;
  selected: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export function ListeningExercise({ payload, selected, onSelect, disabled }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      speakMandarin(payload.hanzi);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [payload.hanzi]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-3xl bg-gradient-to-br from-violet-100 to-purple-100 p-6 shadow-inner">
          <VocabIllustration
            emoji={payload.emoji ?? "👂"}
            imageUrl={payload.imageUrl}
            size="lg"
          />
        </div>
        <AudioButton key={payload.hanzi} text={payload.hanzi} size="lg" />
        <p className="text-sm font-medium text-violet-600">Listen carefully, then choose the meaning</p>
        <p className="text-center text-xs text-stone-400">
          Uses your browser&apos;s Mandarin voice — tap replay if audio sounds unclear
        </p>
      </div>
      <div className="grid gap-3">
        {payload.options.map((option, index) => (
          <Button
            key={`${index}-${option}`}
            variant={selected === option ? "default" : "secondary"}
            className={cn(
              "w-full justify-start h-auto py-4 text-base",
              selected === option && "ring-2 ring-violet-400",
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
