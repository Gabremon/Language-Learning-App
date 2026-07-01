# Hanzi Path — Mandarin Learning App

A Duolingo-inspired web app for learning Mandarin Chinese through rapid-fire exercises. Built with Next.js 15, TypeScript, and Tailwind CSS.

**No authentication required** — progress is saved locally in your browser via `localStorage`.

## Features

- **10 lessons** across 3 units (Basics, Food, Family)
- **8 exercise types**: multiple choice, hanzi→English, English→hanzi word bank, match pairs, listening (TTS), fill-in-the-blank, pinyin recognition, reverse pinyin
- **Lesson player** with progress bar, instant feedback, and XP rewards
- **Spaced repetition review** for vocabulary
- **Vocabulary browser** with search and audio playback
- **Dashboard** with streak, XP, and course path
- **PWA-ready** responsive mobile-first design

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and tap **Start Learning**.

Changes hot-reload automatically — you only need `npm run dev`. If the app ever looks broken or styles disappear, stop the server and run `npm run dev:fresh` once to clear a stale cache.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Home — XP, streak, continue lesson, unit path |
| `/course` | Visual course path |
| `/lesson/[lessonId]` | Lesson player |
| `/review` | Spaced repetition review |
| `/vocabulary` | All course vocabulary |
| `/profile` | Stats and progress reset |

## Progress Storage

Progress (XP, streak, completed lessons, vocab memory) is stored in `localStorage` under the key `mandarin-learn-progress`. Use **Reset progress** on the Profile page to start over.

## Supabase (Optional)

The app runs fully offline with bundled seed data. SQL migrations are in `supabase/migrations/` for when you want to connect a Supabase backend later.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- lucide-react icons
- Browser Speech Synthesis API (`zh-CN`) for listening exercises
