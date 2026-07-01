"use client";

import { Button } from "@/components/ui/button";
import { speakMandarin } from "@/lib/speech";
import type { ListeningPayload } from "@/types/exercises";
import { Volume2 } from "lucide-react";
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
    const timer = setTimeout(() => speakMandarin(payload.hanzi), 300);
    return () => clearTimeout(timer);
  }, [payload.hanzi]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => speakMandarin(payload.hanzi)}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-brand-600 transition hover:bg-brand-200"
          disabled={disabled}
        >
          <Volume2 className="h-10 w-10" />
        </button>
        <p className="text-gray-600">Tap to listen again</p>
      </div>
      <div className="grid gap-3">
        {payload.options.map((option) => (
          <Button
            key={option}
            variant={selected === option ? "default" : "secondary"}
            className={cn("w-full justify-start h-auto py-4", disabled && "pointer-events-none")}
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
