"use client";

import { useEffect, useState } from "react";
import type { UserProgress } from "@/lib/progress";
import { loadProgress } from "@/lib/progress";

export function useLocalProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return progress;
}
