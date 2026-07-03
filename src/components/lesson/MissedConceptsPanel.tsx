"use client";

import type { VocabItem } from "@/types/course";
import { AudioButton } from "@/components/ui/AudioButton";
import { PinyinDisplay } from "@/components/ui/PinyinDisplay";
import { VocabIllustration } from "@/components/ui/VocabIllustration";
import { BookOpen } from "lucide-react";

interface Props {
  vocab: VocabItem[];
}

export function MissedConceptsPanel({ vocab }: Props) {
  if (vocab.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
      <div className="mb-3 flex items-center gap-2 text-amber-900">
        <BookOpen className="h-4 w-4" />
        <p className="text-sm font-bold">Review these concepts</p>
      </div>
      <div className="space-y-2">
        {vocab.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-3 rounded-lg border border-amber-100 bg-white px-3 py-2"
          >
            <VocabIllustration emoji={v.emoji} imageUrl={v.imageUrl} hanzi={v.hanzi} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-stone-800">{v.hanzi}</p>
              <PinyinDisplay pinyin={v.pinyin} size="sm" />
              <p className="text-sm text-stone-600">{v.english}</p>
            </div>
            <AudioButton text={v.hanzi} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
