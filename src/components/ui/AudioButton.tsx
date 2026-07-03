"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { speakMandarin, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AudioButton({ text, size = "md", className }: Props) {
  const [playing, setPlaying] = useState(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    setPlaying(false);
  }, [text]);

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

  const handlePlay = useCallback(() => {
    const currentText = textRef.current.trim();
    if (!currentText) return;

    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }

    speakMandarin(currentText, {
      onStart: () => setPlaying(true),
      onEnd: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
  }, [playing]);

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
