export interface UnitTheme {
  from: string;
  to: string;
  light: string;
  stroke: string;
  glyph: string;
}

const UNIT_THEMES: UnitTheme[] = [
  { from: "#7C3AED", to: "#5B21B6", light: "#EDE9FE", stroke: "#8B5CF6", glyph: "音" },
  { from: "#DB2777", to: "#9D174D", light: "#FCE7F3", stroke: "#EC4899", glyph: "人" },
  { from: "#0284C7", to: "#075985", light: "#E0F2FE", stroke: "#0EA5E9", glyph: "家" },
  { from: "#059669", to: "#047857", light: "#D1FAE5", stroke: "#10B981", glyph: "食" },
  { from: "#EA580C", to: "#C2410C", light: "#FFEDD5", stroke: "#F97316", glyph: "行" },
  { from: "#4F46E5", to: "#3730A3", light: "#E0E7FF", stroke: "#6366F1", glyph: "学" },
];

const GRADUATION_THEME: UnitTheme = {
  from: "#B45309",
  to: "#92400E",
  light: "#FEF3C7",
  stroke: "#F59E0B",
  glyph: "毕",
};

export function getUnitTheme(orderIndex: number, unitId?: string): UnitTheme {
  if (unitId?.includes("final")) return GRADUATION_THEME;
  return UNIT_THEMES[(orderIndex - 1) % UNIT_THEMES.length];
}

export type TrailSide = "left" | "center" | "right";

export function getTrailSide(index: number): TrailSide {
  const pattern: TrailSide[] = ["left", "center", "right", "center"];
  return pattern[index % pattern.length];
}

export const SECTION_STYLES = {
  starter: {
    paper: "from-amber-50/80 via-orange-50/40 to-white",
    border: "border-amber-200/60",
    accent: "#D97706",
    glyph: "起",
  },
  hsk1: {
    paper: "from-sky-50/80 via-brand-50/40 to-white",
    border: "border-brand-200/60",
    accent: "#0284C7",
    glyph: "一",
  },
} as const;
