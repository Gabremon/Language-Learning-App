"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllVocab } from "@/data/seed";
import { speakMandarin } from "@/lib/speech";
import { Volume2, Search } from "lucide-react";

export default function VocabularyPage() {
  const [search, setSearch] = useState("");
  const vocab = getAllVocab();

  const filtered = vocab.filter(
    (v) =>
      v.hanzi.includes(search) ||
      v.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      v.english.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Vocabulary</h1>
          <p className="text-gray-500">{vocab.length} words in your course</p>
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

        <div className="space-y-3">
          {filtered.map((v) => (
            <Card key={v.id} className="transition hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-brand-800">{v.hanzi}</span>
                  <div>
                    <p className="font-medium text-brand-600">{v.pinyin}</p>
                    <p className="text-gray-700">{v.english}</p>
                    <Badge variant="muted" className="mt-1 text-xs">{v.partOfSpeech}</Badge>
                  </div>
                </div>
                <button
                  onClick={() => speakMandarin(v.hanzi)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 hover:bg-brand-100"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
