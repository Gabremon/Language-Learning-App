"use client";

import { useEffect } from "react";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { preloadVoices } from "@/lib/speech";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    preloadVoices();
  }, []);

  return (
    <ProgressProvider>
      <GamificationProvider>{children}</GamificationProvider>
    </ProgressProvider>
  );
}
