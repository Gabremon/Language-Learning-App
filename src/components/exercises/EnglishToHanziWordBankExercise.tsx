"use client";

import { Button } from "@/components/ui/button";
import type { EnglishToHanziWordBankPayload } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface Props {
  payload: EnglishToHanziWordBankPayload;
  selected: string[];
  onSelect: (chars: string[]) => void;
  disabled?: boolean;
}

export function EnglishToHanziWordBankExercise({ payload, selected, onSelect, disabled }: Props) {
  const usedCounts = selected.reduce<Record<string, number>>((acc, c) => {
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  const bankCounts = payload.wordBank.reduce<Record<string, number>>((acc, c) => {
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  function handleTap(char: string) {
    if (disabled) return;
    const used = usedCounts[char] ?? 0;
    const available = bankCounts[char] ?? 0;
    if (used >= available) return;
    onSelect([...selected, char]);
  }

  function handleRemove(index: number) {
    if (disabled) return;
    onSelect(selected.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-2xl font-bold text-gray-800">{payload.english}</p>
      <div className="flex min-h-[60px] flex-wrap justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 p-4">
        {selected.length === 0 ? (
          <span className="text-gray-400">Tap characters below</span>
        ) : (
          selected.map((char, i) => (
            <button
              key={`${char}-${i}`}
              onClick={() => handleRemove(i)}
              className={cn(
                "rounded-xl bg-white px-4 py-2 text-2xl font-bold shadow-sm transition hover:bg-red-50",
                disabled && "pointer-events-none"
              )}
            >
              {char}
            </button>
          ))
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {payload.wordBank.map((char, i) => {
          const used = usedCounts[char] ?? 0;
          const available = bankCounts[char] ?? 0;
          const isUsedUp = used >= available;
          return (
            <Button
              key={`${char}-${i}`}
              variant="secondary"
              size="sm"
              className="text-xl h-12 w-12"
              onClick={() => handleTap(char)}
              disabled={disabled || isUsedUp}
            >
              {char}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
