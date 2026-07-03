"use client";

import { useEffect } from "react";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { preloadVoices } from "@/lib/speech";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    preloadVoices();
  }, []);

  return <ProgressProvider>{children}</ProgressProvider>;
}
