"use client";

import { Button } from "@/components/ui/button";
import { PinyinDisplay } from "@/components/ui/PinyinDisplay";
import type { DialogueResponsePayload } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface Props {
  payload: DialogueResponsePayload;
  selected: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export function DialogueResponseExercise({ payload, selected, onSelect, disabled }: Props) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-3 rounded-2xl border border-stone-200/80 bg-white/80 p-4">
        {payload.lines.map((line, index) => (
          <div
            key={`${index}-${line.hanzi}`}
            className={cn(
              "flex gap-3",
              line.speaker === "B" || line.speaker === "You" ? "flex-row-reverse" : ""
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {line.speaker}
            </span>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5",
                line.speaker === "B" || line.speaker === "You"
                  ? "bg-brand-600 text-white"
                  : "bg-stone-100 text-stone-800"
              )}
            >
              <p className="text-xl font-bold">{line.hanzi}</p>
              {line.pinyin && (
                <div className={line.speaker === "B" || line.speaker === "You" ? "text-brand-100" : ""}>
                  <PinyinDisplay pinyin={line.pinyin} size="sm" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-lg font-medium text-gray-700">{payload.question}</p>
      <div className="grid gap-3">
        {payload.options.map((option, index) => (
          <Button
            key={`${index}-${option}`}
            variant={selected === option ? "default" : "secondary"}
            className={cn(
              "w-full justify-start text-left h-auto py-4 text-lg font-semibold transition-all",
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
