"use client";

import Link from "next/link";
import { Check, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UnitTheme, TrailSide } from "@/lib/unit-themes";
import { InkConnector } from "./InkConnector";

export type LessonTileState = "locked" | "available" | "current" | "completed";

interface Props {
  title: string;
  orderIndex: number;
  state: LessonTileState;
  theme: UnitTheme;
  side: TrailSide;
  href?: string;
  isReview?: boolean;
  showConnector?: boolean;
  connectorFilled?: boolean;
}

const sideClass: Record<TrailSide, string> = {
  left: "mr-auto ml-2",
  center: "mx-auto",
  right: "ml-auto mr-2",
};

export function LessonTile({
  title,
  orderIndex,
  state,
  theme,
  side,
  href,
  isReview,
  showConnector = true,
  connectorFilled = false,
}: Props) {
  const tile = (
    <div className={cn("group relative flex w-[min(100%,13.5rem)] items-center gap-2.5", sideClass[side])}>
      <div
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.65rem] text-xs font-bold transition-transform",
          "rotate-[-2deg] group-hover:rotate-0",
          state === "locked" && "bg-stone-200 text-stone-400 shadow-inner",
          state === "available" && "text-white ink-trail-shadow",
          state === "current" && "text-white ink-trail-shadow animate-ink-pulse",
          state === "completed" && "bg-emerald-500 text-white ink-trail-shadow"
        )}
        style={
          state === "available" || state === "current"
            ? { background: `linear-gradient(145deg, ${theme.from}, ${theme.to})` }
            : undefined
        }
      >
        {state === "locked" ? (
          <Lock className="h-3.5 w-3.5" />
        ) : state === "completed" ? (
          <Check className="h-4 w-4 stroke-[3]" />
        ) : isReview ? (
          <Star className="h-3.5 w-3.5 fill-white/30" />
        ) : (
          orderIndex
        )}
        {state === "current" && (
          <span
            className="absolute -inset-1 rounded-[0.8rem] border-2 border-white/80"
            style={{ boxShadow: `0 0 0 2px ${theme.stroke}55` }}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-xs font-semibold leading-tight",
            state === "locked" ? "text-stone-400" : "text-stone-700",
            state === "current" && "text-stone-900"
          )}
        >
          {title}
        </p>
        {isReview && state !== "locked" && (
          <p className="text-[10px] font-medium" style={{ color: theme.stroke }}>
            Unit review
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative py-0.5">
      {showConnector && (
        <InkConnector
          side={side}
          color={connectorFilled ? theme.stroke : "#D6D3D1"}
          filled={connectorFilled}
        />
      )}
      {state === "locked" || !href ? (
        <div className="opacity-70">{tile}</div>
      ) : (
        <Link href={href} className="block rounded-lg transition hover:bg-white/60">
          {tile}
        </Link>
      )}
    </div>
  );
}
