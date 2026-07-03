"use client";

import { cn } from "@/lib/utils";
import {
  getSyllableTone,
  PINYIN_TONE_COLORS,
  splitPinyinTokens,
} from "@/lib/pinyin";

interface Props {
  pinyin: string;
  size?: "sm" | "md" | "lg";
  showToneLabels?: boolean;
  className?: string;
}

export function PinyinDisplay({ pinyin, size = "md", showToneLabels = false, className }: Props) {
  const sizeClass = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  const syllables = splitPinyinTokens(pinyin);

  return (
    <div className={cn("flex flex-wrap items-end justify-center gap-x-2 gap-y-1", className)}>
      {syllables.map((syllable, i) => {
        const tone = getSyllableTone(syllable);
        return (
          <span key={`${i}-${syllable}`} className="inline-flex flex-col items-center">
            <span
              className={cn(
                "font-medium tracking-wide",
                sizeClass,
                PINYIN_TONE_COLORS[tone]
              )}
            >
              {syllable}
            </span>
            {showToneLabels && tone !== "0" && (
              <span className="text-[10px] text-stone-400">{tone}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
