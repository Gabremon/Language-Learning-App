"use client";

import { Button } from "@/components/ui/button";
import type { MatchPairsPayload } from "@/types/exercises";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  payload: MatchPairsPayload;
  matches: Record<string, string>;
  onMatch: (matches: Record<string, string>) => void;
  disabled?: boolean;
}

export function MatchPairsExercise({ payload, matches, onMatch, disabled }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const matchedRights = new Set(Object.values(matches));

  function handleLeftClick(id: string) {
    if (disabled || matches[id]) return;
    setSelectedLeft(selectedLeft === id ? null : id);
  }

  function handleRightClick(right: string) {
    if (disabled || matchedRights.has(right) || !selectedLeft) return;
    onMatch({ ...matches, [selectedLeft]: right });
    setSelectedLeft(null);
  }

  function handleReset(id: string) {
    if (disabled) return;
    const next = { ...matches };
    delete next[id];
    onMatch(next);
  }

  const rights = payload.pairs.map((p) => p.right);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-500">Hanzi</p>
        {payload.pairs.map((pair) => (
          <button
            key={pair.id}
            onClick={() => (matches[pair.id] ? handleReset(pair.id) : handleLeftClick(pair.id))}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl border-2 px-4 py-3 text-2xl font-bold transition",
              matches[pair.id]
                ? "border-success bg-green-50 text-green-800"
                : selectedLeft === pair.id
                  ? "border-brand-500 bg-brand-50"
                  : "border-brand-200 bg-white hover:border-brand-400"
            )}
          >
            {pair.left}
            {matches[pair.id] && (
              <span className="ml-2 text-sm font-normal text-green-600">✓ {matches[pair.id]}</span>
            )}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-500">English</p>
        {rights.map((right) => (
          <Button
            key={right}
            variant={matchedRights.has(right) ? "ghost" : "secondary"}
            className={cn(
              "w-full justify-start",
              matchedRights.has(right) && "opacity-40"
            )}
            onClick={() => handleRightClick(right)}
            disabled={disabled || matchedRights.has(right) || !selectedLeft}
          >
            {right}
          </Button>
        ))}
      </div>
    </div>
  );
}
