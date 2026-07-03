import { cn } from "@/lib/utils";
import type { TrailSide } from "@/lib/unit-themes";

interface Props {
  side: TrailSide;
  color: string;
  filled?: boolean;
  className?: string;
}

const sideX: Record<TrailSide, number> = {
  left: 28,
  center: 50,
  right: 72,
};

export function InkConnector({ side, color, filled = false, className }: Props) {
  const x = sideX[side];

  return (
    <svg
      className={cn("pointer-events-none absolute -top-3 left-0 h-3 w-full overflow-visible", className)}
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={`M ${x} 12 C ${x} 8, 50 6, 50 0`}
        fill="none"
        stroke={color}
        strokeWidth={filled ? 2.5 : 1.75}
        strokeLinecap="round"
        opacity={filled ? 0.85 : 0.35}
      />
    </svg>
  );
}

/** Horizontal connector for dashboard mini-trail */
export function InkConnectorHorizontal({
  filled = false,
  color = "#D6D3D1",
}: {
  filled?: boolean;
  color?: string;
}) {
  return (
    <svg className="h-2 w-5 shrink-0" viewBox="0 0 20 8" aria-hidden>
      <path
        d="M 0 4 C 5 2, 15 6, 20 4"
        fill="none"
        stroke={color}
        strokeWidth={filled ? 2.25 : 1.5}
        strokeLinecap="round"
        opacity={filled ? 0.9 : 0.4}
      />
    </svg>
  );
}
