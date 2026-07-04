"use client";

import { Button } from "@/components/ui/button";
import { AutoFocusInput } from "@/components/ui/AutoFocusInput";
import { VocabIllustration } from "@/components/ui/VocabIllustration";
import { AudioButton } from "@/components/ui/AudioButton";
import type { ToneAndEnglishAnswer, ToneAndEnglishPayload } from "@/types/exercises";
import { PINYIN_TONE_COLORS } from "@/lib/pinyin";
import { cn } from "@/lib/utils";

const TONE_CHOICES = [
  { tone: "1", label: "1st", hint: "high flat" },
  { tone: "2", label: "2nd", hint: "rising" },
  { tone: "3", label: "3rd", hint: "dip" },
  { tone: "4", label: "4th", hint: "falling" },
] as const;

interface Props {
  payload: ToneAndEnglishPayload;
  value: ToneAndEnglishAnswer | null;
  onChange: (answer: ToneAndEnglishAnswer) => void;
  disabled?: boolean;
}

export function ToneAndEnglishExercise({ payload, value, onChange, disabled }: Props) {
  const selectedTone = value?.tone ?? null;
  const english = value?.english ?? "";

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
        <AudioButton key={payload.hanzi} text={payload.hanzi} size="md" />
      </div>

      <div className="space-y-2">
        <p className="text-center text-sm font-medium text-gray-600">Which tone is this syllable?</p>
        <div className="grid grid-cols-4 gap-2">
          {TONE_CHOICES.filter((choice) => payload.toneOptions.includes(choice.tone)).map(
            (choice) => (
              <Button
                key={choice.tone}
                type="button"
                variant={selectedTone === choice.tone ? "default" : "secondary"}
                className={cn(
                  "flex h-auto flex-col gap-0.5 py-3",
                  selectedTone === choice.tone && "ring-2 ring-sky-400",
                  disabled && "pointer-events-none"
                )}
                onClick={() => onChange({ tone: choice.tone, english })}
                disabled={disabled}
              >
                <span className={cn("text-lg font-bold", PINYIN_TONE_COLORS[choice.tone])}>
                  {choice.label}
                </span>
                <span className="text-[10px] font-normal text-stone-500">{choice.hint}</span>
              </Button>
            )
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-center text-sm font-medium text-gray-600">Type the English meaning</p>
        <AutoFocusInput
          focusKey={payload.hanzi}
          placeholder="e.g. mother"
          value={english}
          onChange={(e) =>
            onChange({ tone: selectedTone ?? "", english: e.target.value })
          }
          disabled={disabled}
          className="py-6 text-lg"
        />
      </div>
    </div>
  );
}
