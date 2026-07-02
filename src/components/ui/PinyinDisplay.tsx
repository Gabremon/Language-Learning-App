"use client";

import { cn } from "@/lib/utils";

const TONE_COLORS: Record<string, string> = {
  "1": "text-red-500",
  "2": "text-orange-500",
  "3": "text-green-500",
  "4": "text-blue-500",
  "0": "text-gray-400",
};

const TONE_MARKS: Record<string, string> = {
  ā: "1",
  á: "2",
  ǎ: "3",
  à: "4",
  ē: "1",
  é: "2",
  ě: "3",
  è: "4",
  ī: "1",
  í: "2",
  ǐ: "3",
  ì: "4",
  ō: "1",
  ó: "2",
  ǒ: "3",
  ò: "4",
  ū: "1",
  ú: "2",
  ǔ: "3",
  ù: "4",
  ǖ: "1",
  ǘ: "2",
  ǚ: "3",
  ǜ: "4",
};

function getTone(char: string): string {
  return TONE_MARKS[char] ?? "0";
}

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

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-0.5", className)}>
      {pinyin.split("").map((char, i) => {
        const tone = getTone(char);
        return (
          <span key={i} className="inline-flex flex-col items-center">
            <span className={cn("font-medium tracking-wide", sizeClass, TONE_COLORS[tone])}>
              {char}
            </span>
            {showToneLabels && tone !== "0" && (
              <span className="text-[10px] text-gray-400">{tone}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
