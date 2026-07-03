"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  variant = "paper",
}: {
  children: React.ReactNode;
  variant?: "default" | "paper";
}) {
  return (
    <div
      className={cn(
        "min-h-screen pb-20",
        variant === "paper" ? "bg-paper" : "bg-gradient-to-b from-brand-50 to-white"
      )}
    >
      <main className="mx-auto max-w-2xl px-3 py-4 sm:px-4">{children}</main>
      <BottomNav />
    </div>
  );
}
