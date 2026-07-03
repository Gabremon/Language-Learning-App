import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { BookOpen, Brain, Headphones, RotateCcw } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-12">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-brand-300 bg-white text-4xl font-bold text-brand-700 ink-trail-shadow">
          环
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">{APP_TAGLINE}</p>
        <h1 className="mt-1 text-center text-3xl font-extrabold text-stone-800">{APP_NAME}</h1>
        <p className="mt-2 text-center text-stone-600">
          Bite-sized Mandarin lessons, spaced review, and a visual learning path — loop back daily and build fluency.
        </p>

        <div className="mt-8 grid w-full gap-2">
          {[
            { icon: BookOpen, text: "117-lesson Starter + full HSK 1 path" },
            { icon: Brain, text: "8 exercise types with progressive difficulty" },
            { icon: Headphones, text: "Listening exercises with browser speech" },
            { icon: RotateCcw, text: "Spaced repetition review synced to your account" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl border border-stone-200/70 bg-white/80 px-4 py-3 shadow-sm"
            >
              <Icon className="h-4 w-4 shrink-0 text-brand-600" />
              <span className="text-sm text-stone-700">{text}</span>
            </div>
          ))}
        </div>

        <Link href="/auth" className="mt-8 w-full">
          <Button size="lg" className="w-full shadow-md">
            Start learning
          </Button>
        </Link>
      </div>
    </div>
  );
}
