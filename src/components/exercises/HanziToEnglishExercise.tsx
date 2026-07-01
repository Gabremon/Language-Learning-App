"use client";

import { Input } from "@/components/ui/input";
import type { HanziToEnglishPayload } from "@/types/exercises";

interface Props {
  payload: HanziToEnglishPayload;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function HanziToEnglishExercise({ payload, value, onChange, disabled }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-brand-800">{payload.hanzi}</p>
        {payload.pinyin && (
          <p className="mt-2 text-lg text-brand-500">{payload.pinyin}</p>
        )}
      </div>
      <Input
        placeholder="Type the English meaning..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoFocus
      />
    </div>
  );
}
