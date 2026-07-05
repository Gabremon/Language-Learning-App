"use client";

import { Button } from "@/components/ui/button";
import { PinyinDisplay } from "@/components/ui/PinyinDisplay";
import type { YesNoQuestionPayload } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface Props {
  payload: YesNoQuestionPayload;
  selected: "yes" | "no" | null;
  onSelect: (answer: "yes" | "no") => void;
  disabled?: boolean;
}

export function YesNoQuestionExercise({ payload, selected, onSelect, disabled }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-stone-200/80 bg-gradient-to-br from-sky-50 to-blue-50 p-6 text-center">
        <p className="text-3xl font-bold text-brand-800">{payload.statement}</p>
        {payload.statementPinyin && (
          <div className="mt-2 flex justify-center">
            <PinyinDisplay pinyin={payload.statementPinyin} size="md" />
          </div>
        )}
      </div>
      <p className="text-center text-lg font-medium text-gray-700">{payload.claim}</p>
      <p className="text-center text-sm font-medium text-stone-500">
        Is this understanding correct?
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={selected === "yes" ? "default" : "secondary"}
          className={cn(
            "h-16 text-lg font-semibold",
            selected === "yes" && "ring-2 ring-emerald-400",
            disabled && "pointer-events-none"
          )}
          onClick={() => onSelect("yes")}
          disabled={disabled}
        >
          Yes · 是
        </Button>
        <Button
          variant={selected === "no" ? "default" : "secondary"}
          className={cn(
            "h-16 text-lg font-semibold",
            selected === "no" && "ring-2 ring-rose-400",
            disabled && "pointer-events-none"
          )}
          onClick={() => onSelect("no")}
          disabled={disabled}
        >
          No · 不是
        </Button>
      </div>
    </div>
  );
}
