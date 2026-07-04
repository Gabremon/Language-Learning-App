"use client";

import { cn } from "@/lib/utils";
import {
  getSyllableTone,
  normalizePinyin,
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

  const syllables = splitPinyinTokens(normalizePinyin(pinyin));

  return (
    <span
      className={cn("inline-flex flex-wrap items-end justify-start gap-x-1.5 gap-y-0.5", className)}
      lang="zh-Latn"
    >
      {syllables.map((syllable, i) => {
        const tone = getSyllableTone(syllable);
        return (
          <span
            key={`${i}-${syllable}`}
            className="inline-flex flex-col items-center whitespace-nowrap"
          >
            <span
              className={cn(
                "font-medium tracking-normal",
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
    </span>
  );
}
