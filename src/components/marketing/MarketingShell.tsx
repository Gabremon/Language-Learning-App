import type { ReactNode } from "react";
import Link from "next/link";
import { APP_MARK, APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { demoLessonPath } from "@/lib/demo";
import { cn } from "@/lib/utils";
import { BookOpen, Brain, Headphones, RotateCcw } from "lucide-react";

export const MARKETING_FEATURES = [
  {
    icon: BookOpen,
    title: "Structured path",
    text: "117 lessons from first tones through full HSK 1",
  },
  {
    icon: Brain,
    title: "Active recall",
    text: "Eight exercise types that build reading, listening, and typing",
  },
  {
    icon: Headphones,
    title: "Hear it live",
    text: "Built-in audio so you practice pronunciation as you go",
  },
  {
    icon: RotateCcw,
    title: "Spaced review",
    text: "Smart review keeps vocabulary fresh between lessons",
  },
] as const;

export const MARKETING_STATS = [
  { value: "117", label: "lessons" },
  { value: "278", label: "words" },
  { value: "8", label: "exercise types" },
] as const;

export function BrandMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-10 w-10 text-lg rounded-lg",
    md: "h-14 w-14 text-2xl rounded-xl",
    lg: "h-20 w-20 text-4xl rounded-2xl",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border-2 border-white/30 bg-white/15 font-bold text-white backdrop-blur ink-trail-shadow",
        sizes[size]
      )}
    >
      {APP_MARK}
    </div>
  );
}

export function MarketingNav() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-200 bg-white text-lg font-bold text-brand-700 shadow-sm">
          {APP_MARK}
        </div>
        <div>
          <p className="text-sm font-bold text-stone-800">{APP_NAME}</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            {APP_TAGLINE}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href={demoLessonPath()}
          className="hidden rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-100 sm:inline-flex"
        >
          Try demo
        </Link>
        <Link
          href="/auth"
          className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}

export function MarketingHeroPanel({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex flex-col justify-center overflow-hidden rounded-3xl border border-brand-200/50 bg-gradient-to-br from-brand-500 via-brand-600 to-violet-700 p-8 text-white shadow-xl sm:p-10 lg:min-h-[32rem]">
      <div className="pointer-events-none absolute -right-6 -top-8 text-[9rem] font-bold leading-none opacity-10">
        {APP_MARK}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">
        <BrandMark size="lg" />
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-100/90">
          {APP_TAGLINE}
        </p>
        <h1 className="mt-2 max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Learn Mandarin through fast exercises
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-50/90 sm:text-base">
          Short, rapid-fire drills for pinyin, hanzi, and listening — try a free lesson now, then
          sign in to save your progress.
        </p>

        <div className="mt-8 flex flex-wrap gap-6">
          {MARKETING_STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-extrabold">{value}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-brand-100/80">
                {label}
              </p>
            </div>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}

export function MarketingFeatureList() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MARKETING_FEATURES.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className="rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-sm font-bold text-stone-800">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-stone-500">{text}</p>
        </div>
      ))}
    </div>
  );
}

export function LessonPreviewCard() {
  return (
    <Link
      href={demoLessonPath()}
      className="block rounded-2xl border border-stone-200/80 bg-white p-5 shadow-lg ring-1 ring-stone-100 transition hover:border-brand-200 hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Try a lesson</p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
          Free demo
        </span>
      </div>
      <p className="mt-4 text-center text-5xl font-bold text-brand-800">你好</p>
      <p className="mt-1 text-center text-sm text-stone-500">nǐ hǎo</p>
      <p className="mt-4 text-center text-sm font-medium text-stone-600">What does this mean?</p>
      <div className="mt-3 grid gap-2">
        {["hello", "goodbye", "thank you"].map((option, i) => (
          <div
            key={option}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm font-medium",
              i === 0
                ? "border-brand-300 bg-brand-50 text-brand-800"
                : "border-stone-200 bg-stone-50 text-stone-600"
            )}
          >
            {option}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs font-semibold text-brand-600">Tap to start →</p>
    </Link>
  );
}
