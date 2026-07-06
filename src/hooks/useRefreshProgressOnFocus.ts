"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useProgress } from "@/contexts/ProgressContext";

const REFRESH_PATHS = ["/dashboard", "/course"];

/** Re-sync progress from the database when landing on trail views after a lesson. */
export function useRefreshProgressOnFocus() {
  const pathname = usePathname();
  const { refreshProgress, isGuest, user } = useProgress();

  useEffect(() => {
    if (isGuest || !user) return;
    if (!REFRESH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;
    void refreshProgress();
  }, [pathname, refreshProgress, isGuest, user]);
}
