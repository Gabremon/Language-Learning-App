# Hanzi Path — Mandarin Learning App

A Duolingo-inspired web app for learning Mandarin Chinese through rapid-fire exercises. Built with Next.js 15, TypeScript, and Tailwind CSS.

**Sign in with Google** — progress (XP, streak, lessons, vocab memory) is saved to Supabase per account.

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

Open [http://localhost:3000](http://localhost:3000) and sign in with Google to start learning.

Changes hot-reload automatically — you only need `npm run dev`. If the app ever looks broken or styles disappear, stop the server and run `npm run dev:fresh` once to clear a stale cache.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth` | Sign in with Google |
| `/dashboard` | Home — XP, streak, continue lesson, unit path |
| `/course` | Visual course path |
| `/lesson/[lessonId]` | Lesson player |
| `/review` | Spaced repetition review |
| `/vocabulary` | All course vocabulary |
| `/profile` | Stats, sign out, reset progress |

## Progress Storage

Progress is stored in Supabase per user: `user_progress`, `lesson_attempts`, and `vocab_memory`. Sign in with Google to sync across devices.

## Supabase

Everything is in a single file: **`supabase/setup.sql`**. The app loads all course content from Supabase (no local fallback).

### Environment variables

Use the **Project URL** from Supabase Dashboard → Settings → API. It should look like:

```
https://your-project.supabase.co
```

Do **not** include `/rest/v1` — the Supabase client adds that automatically.

### 1. Create a project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy **Project URL** and **anon key** from **Project Settings → API**.
3. Copy `.env.example` to `.env.local` and paste your values.

### 2. Run the setup SQL

In the Supabase dashboard **SQL Editor**, paste and run the entire contents of `supabase/setup.sql`.

This will:
- **Drop every table** in the `public` schema (full reset)
- Recreate all tables (schema)
- Insert the Mandarin course, 10 lessons, 37 vocab items, and 140 exercises
- Enable row-level security policies

### 3. Regenerate after seed changes

If you change `src/data/seed.ts`, regenerate the SQL file:

```bash
npm run db:generate-seed
```

Then re-run `supabase/setup.sql` in the SQL Editor.

### Schema overview

- **Content tables** (`courses`, `units`, `lessons`, `vocab_items`, `exercises`, etc.) use text IDs matching the app (`lesson-1-1`, etc.) and are publicly readable.
- **User tables** (`user_progress`, `lesson_attempts`, `exercise_attempts`, `vocab_memory`) use UUIDs tied to `auth.users` and are private per user.

### Google sign-in setup

1. **Supabase Dashboard** → Authentication → Providers → **Google** → Enable.
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Application type: Web application
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Paste the Google **Client ID** and **Client Secret** into Supabase Google provider settings.
4. **Supabase Dashboard** → Authentication → URL Configuration → add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/callback` (if port 3000 is in use)
   - Your production URL + `/auth/callback`

If progress saving fails with **"there is no unique or exclusion constraint matching the ON CONFLICT specification"**, your database is missing unique constraints required for upserts. Run once in the Supabase SQL Editor:

```sql
-- Or run: supabase/migrations/20260702000000_add_progress_unique_constraints.sql
alter table user_progress
  add constraint user_progress_user_course_unique unique (user_id, course_id);

alter table vocab_memory
  add constraint vocab_memory_user_vocab_unique unique (user_id, vocab_item_id);
```

(Skip any statement that errors with "already exists".)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database, auth, progress)
- lucide-react icons
- Browser Speech Synthesis API (`zh-CN`) for listening exercises
