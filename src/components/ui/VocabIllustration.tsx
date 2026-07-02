"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  emoji?: string;
  imageUrl?: string;
  hanzi?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function VocabIllustration({ emoji, imageUrl, hanzi, size = "md", className }: Props) {
  const sizeMap = {
    sm: { box: "h-16 w-16", emoji: "text-3xl", hanzi: "text-2xl" },
    md: { box: "h-24 w-24", emoji: "text-5xl", hanzi: "text-3xl" },
    lg: { box: "h-32 w-32", emoji: "text-6xl", hanzi: "text-4xl" },
    xl: { box: "h-40 w-40", emoji: "text-7xl", hanzi: "text-5xl" },
  };

  const s = sizeMap[size];

  if (imageUrl) {
    return (
      <div
        className={cn(
          "relative mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 shadow-inner ring-2 ring-brand-100",
          s.box,
          className
        )}
      >
        <Image
          src={imageUrl}
          alt={hanzi ?? "vocabulary illustration"}
          fill
          className="object-contain p-2"
          sizes="160px"
        />
      </div>
    );
  }

  if (emoji) {
    return (
      <div
        className={cn(
          "mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 shadow-inner ring-2 ring-white",
          s.box,
          className
        )}
      >
        <span className={s.emoji} role="img" aria-label={hanzi}>
          {emoji}
        </span>
      </div>
    );
  }

  if (hanzi) {
    return (
      <div
        className={cn(
          "mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 font-bold text-brand-800",
          s.box,
          s.hanzi,
          className
        )}
      >
        {hanzi}
      </div>
    );
  }

  return null;
}
