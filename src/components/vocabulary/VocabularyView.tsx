"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-brand-500 to-violet-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Vocabulary</h1>
          <p className="text-brand-100">{vocab.length} words in your course</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search hanzi, pinyin, or English..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((v) => (
            <Card key={v.id} className="overflow-hidden border-0 shadow-md ring-1 ring-gray-100 transition hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-4">
                <VocabIllustration emoji={v.emoji} imageUrl={v.imageUrl} hanzi={v.hanzi} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-2xl font-bold text-brand-800">{v.hanzi}</p>
                  <PinyinDisplay pinyin={v.pinyin} size="sm" />
                  <p className="mt-1 text-gray-700">{v.english}</p>
                  <Badge variant="muted" className="mt-1 text-xs">{v.partOfSpeech}</Badge>
                </div>
                <AudioButton text={v.hanzi} size="sm" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
