"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InkHero, InkPageHeader, InkPanel } from "@/components/ui/ink-shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VocabIllustration } from "@/components/ui/VocabIllustration";
import { PinyinDisplay } from "@/components/ui/PinyinDisplay";
import { AudioButton } from "@/components/ui/AudioButton";
import type { VocabItem } from "@/types/course";
import { Search } from "lucide-react";

interface Props {
  vocab: VocabItem[];
}

export function VocabularyView({ vocab }: Props) {
  const [search, setSearch] = useState("");

  const filtered = vocab.filter(
    (v) =>
      v.hanzi.includes(search) ||
      v.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      v.english.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-4">
        <InkHero glyph="词" title="Word scroll" subtitle={`${vocab.length} words on your trail`} />

        <InkPageHeader
          eyebrow="词 · Vocabulary"
          title="Your word collection"
          subtitle="Search hanzi, pinyin, or English"
        />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-stone-200 bg-white/80 pl-9"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map((v) => (
            <InkPanel key={v.id} className="transition hover:shadow-md">
              <div className="flex items-center gap-3 p-3">
                <VocabIllustration emoji={v.emoji} imageUrl={v.imageUrl} hanzi={v.hanzi} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-stone-800">{v.hanzi}</p>
                  <PinyinDisplay pinyin={v.pinyin} size="sm" />
                  <p className="mt-0.5 text-sm text-stone-600">{v.english}</p>
                  <Badge variant="muted" className="mt-1 text-[10px]">
                    {v.partOfSpeech}
                  </Badge>
                </div>
                <AudioButton text={v.hanzi} size="sm" />
              </div>
            </InkPanel>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
