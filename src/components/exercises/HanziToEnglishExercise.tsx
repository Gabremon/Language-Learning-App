"use client";

import { Input } from "@/components/ui/input";
import { VocabIllustration } from "@/components/ui/VocabIllustration";
import { PinyinDisplay } from "@/components/ui/PinyinDisplay";
import { AudioButton } from "@/components/ui/AudioButton";
import type { HanziToEnglishPayload } from "@/types/exercises";

interface Props {
  payload: HanziToEnglishPayload;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function HanziToEnglishExercise({ payload, value, onChange, disabled }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <VocabIllustration
          emoji={payload.emoji}
          imageUrl={payload.imageUrl}
          hanzi={payload.hanzi}
          size="lg"
        />
        <p className="text-6xl font-bold text-brand-800">{payload.hanzi}</p>
        {payload.pinyin && (
          <div className="flex items-center gap-3">
            <PinyinDisplay pinyin={payload.pinyin} size="lg" showToneLabels />
            <AudioButton text={payload.hanzi} size="md" />
          </div>
        )}
      </div>
      <Input
        placeholder="Type the English meaning..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoFocus
        className="text-lg py-6"
      />
    </div>
  );
}
