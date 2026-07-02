"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { speakMandarin, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  size?: "sm" | "md" | "lg";
  autoPlay?: boolean;
  className?: string;
}

export function AudioButton({ text, size = "md", autoPlay = false, className }: Props) {
  const [playing, setPlaying] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  function handlePlay() {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    speakMandarin(text);
    setTimeout(() => setPlaying(false), 1500);
  }

  if (autoPlay && typeof window !== "undefined") {
    // Auto-play handled by parent via useEffect
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={cn(
        "flex items-center justify-center rounded-full bg-brand-100 text-brand-600 transition-all hover:bg-brand-200 hover:scale-105 active:scale-95",
        playing && "bg-brand-500 text-white ring-4 ring-brand-200",
        sizeClasses[size],
        className
      )}
      aria-label={`Play pronunciation of ${text}`}
    >
      {playing ? (
        <VolumeX className={iconSizes[size]} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </button>
  );
}
