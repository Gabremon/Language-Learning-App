import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/brand";
import {
  LessonPreviewCard,
  MarketingFeatureList,
  MarketingHeroPanel,
  MarketingNav,
} from "@/components/marketing/MarketingShell";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <MarketingNav />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-2">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="animate-slide-up space-y-8">
            <MarketingHeroPanel>
              <Link href="/auth" className="mt-8 inline-flex">
                <Button
                  size="lg"
                  className="h-14 bg-white px-8 text-base font-bold text-brand-700 shadow-lg hover:bg-brand-50"
                >
                  Get started free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </MarketingHeroPanel>
          </div>

          <div className="animate-slide-up space-y-6 [animation-delay:80ms]">
            <LessonPreviewCard />

            <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm text-stone-600">
                <span className="font-semibold text-stone-800">No credit card.</span> Sign in with
                Google and your streak, XP, and review schedule sync everywhere.
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
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 w-full px-10 shadow-lg sm:w-auto">
                Start your first lesson
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-stone-400">Takes less than a minute to set up</p>
          </div>
        </section>
      </main>
    </div>
  );
}
