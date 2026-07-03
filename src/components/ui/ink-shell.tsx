import { cn } from "@/lib/utils";

interface InkPageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  glyph?: string;
  className?: string;
}

export function InkPageHeader({ eyebrow, title, subtitle, glyph, className }: InkPageHeaderProps) {
  return (
    <header className={cn("relative", className)}>
      {glyph && (
        <span className="pointer-events-none absolute -right-1 -top-2 text-4xl font-bold text-stone-200">
          {glyph}
        </span>
      )}
      {eyebrow && (
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">{eyebrow}</p>
      )}
      <h1 className="text-xl font-bold text-stone-800">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
    </header>
  );
}

interface InkHeroProps {
  glyph?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function InkHero({ glyph = "汉", title, subtitle, children, className }: InkHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-200/50 bg-gradient-to-br from-brand-500 via-brand-600 to-violet-700 p-4 text-white shadow-lg",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-2 -top-4 text-7xl font-bold opacity-10">
        {glyph}
      </div>
      <div className="relative">
        <h1 className="text-lg font-bold">{title}</h1>
        {subtitle && <p className="text-xs text-brand-100">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

interface InkPanelProps {
  children: React.ReactNode;
  className?: string;
  tint?: string;
}

export function InkPanel({ children, className, tint }: InkPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200/70 bg-white/85 shadow-sm backdrop-blur",
        className
      )}
      style={tint ? { background: `linear-gradient(135deg, ${tint}22, white)` } : undefined}
    >
      {children}
    </div>
  );
}

interface InkProgressProps {
  value: number;
  className?: string;
  accent?: string;
}

export function InkProgress({ value, className, accent = "#0284C7" }: InkProgressProps) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-stone-200/80", className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: `linear-gradient(90deg, ${accent}, #38bdf8)`,
        }}
      />
    </div>
  );
}

interface InkStatProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  ring?: string;
}

export function InkStat({ icon, value, label, ring = "ring-stone-200/80" }: InkStatProps) {
  return (
    <div className={cn("rounded-xl border-0 bg-white/80 p-2.5 text-center shadow-sm ring-1 backdrop-blur", ring)}>
      <div className="flex justify-center">{icon}</div>
      <p className="text-lg font-bold text-stone-800">{value}</p>
      <p className="text-[10px] font-semibold text-stone-500">{label}</p>
    </div>
  );
}
