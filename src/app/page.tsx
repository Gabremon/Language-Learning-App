import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Headphones, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-500 via-brand-400 to-brand-600">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-12 text-white">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
          <span className="text-4xl font-bold">汉</span>
        </div>
        <h1 className="text-center text-4xl font-extrabold tracking-tight">Hanzi Path</h1>
        <p className="mt-3 text-center text-lg text-brand-100">
          Learn Mandarin through bite-sized lessons, just like your favorite language app — but uniquely yours.
        </p>

        <div className="mt-10 grid w-full gap-4">
          {[
            { icon: BookOpen, text: "Structured course with 10 lessons across 3 units" },
            { icon: Brain, text: "8 exercise types: hanzi, pinyin, listening & more" },
            { icon: Headphones, text: "Built-in speech synthesis for listening practice" },
            { icon: Sparkles, text: "Spaced repetition to lock in vocabulary" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>

        <Link href="/dashboard" className="mt-10 w-full">
          <Button size="lg" variant="secondary" className="w-full text-brand-700">
            Start Learning
          </Button>
        </Link>
      </div>
    </div>
  );
}
