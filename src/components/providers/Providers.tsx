"use client";

import { ProgressProvider } from "@/contexts/ProgressContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
