import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/brand";
import { demoLessonPath } from "@/lib/demo";
import {
  LessonPreviewCard,
  MarketingFeatureList,
  MarketingHeroPanel,
  MarketingNav,
} from "@/components/marketing/MarketingShell";
import { ArrowRight, Play } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <MarketingNav />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-2">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="animate-slide-up space-y-8">
            <MarketingHeroPanel>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={demoLessonPath()} className="inline-flex">
                  <Button
                    size="lg"
                    className="h-14 bg-white px-8 text-base font-bold text-brand-700 shadow-lg hover:bg-brand-50"
                  >
                    <Play className="h-5 w-5" />
                    Start demo lesson
                  </Button>
                </Link>
                <Link href="/auth" className="inline-flex">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-14 border-white/30 bg-white/15 px-8 text-base font-bold text-white backdrop-blur hover:bg-white/25"
                  >
                    Sign up to save progress
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </MarketingHeroPanel>
          </div>

          <div className="animate-slide-up space-y-6 [animation-delay:80ms]">
            <LessonPreviewCard />

            <div className="flex items-start gap-3 rounded-2xl border border-brand-200/80 bg-gradient-to-r from-brand-50 to-violet-50 px-4 py-3">
              <Play className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              <p className="text-sm text-stone-600">
                <span className="font-semibold text-stone-800">No account needed to try.</span>{" "}
                Play the first lesson instantly — sign in when you&apos;re ready to keep your streak
                and XP.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-16 animate-fade-in [animation-delay:160ms]">
          <div className="mb-6 text-center lg:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-600">
              Why {APP_NAME}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-stone-800 sm:text-3xl">
              Everything you need to build a daily habit
            </h2>
            <p className="mt-2 max-w-2xl text-stone-500">
              Bite-sized sessions, a clear path forward, and review that adapts to what you miss —
              so every minute counts.
            </p>
          </div>

          <MarketingFeatureList />

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href={demoLessonPath()} className="w-full sm:w-auto">
              <Button size="lg" className="h-14 w-full px-10 shadow-lg sm:w-auto">
                <Play className="h-5 w-5" />
                Start demo lesson
              </Button>
            </Link>
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="h-14 w-full px-8 sm:w-auto">
                Sign up to save progress
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
