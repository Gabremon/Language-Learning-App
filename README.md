# Lexloop — Mandarin Learning App

Bite-sized Mandarin lessons, spaced repetition review, and a visual HSK 1 learning path. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

**Sign in with Google** — progress (XP, streak, lessons, vocab memory) syncs to your account.

## Features

- **117 lessons** across 21 units (Starter + full HSK 1)
- **8 exercise types**: multiple choice, hanzi→English, English→hanzi word bank, match pairs, listening (browser TTS), fill-in-the-blank, pinyin recognition, reverse pinyin
- **Lesson player** with progress bar, review round for misses, and XP rewards
- **Spaced repetition review** for vocabulary
- **Vocabulary browser** with search and audio playback
- **Dashboard** with streak, XP, and course path
- **Responsive mobile-first** design

## Quick Start (local)

```bash
npm install
cp .env.example .env.local   # add your Supabase URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

If styles look broken, run `npm run dev:fresh` once to clear a stale Next.js cache.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth` | Sign in with Google |
| `/dashboard` | Home — XP, streak, continue lesson, unit path |
| `/course` | Visual learning path |
| `/lesson/[lessonId]` | Lesson player |
| `/review` | Spaced repetition review |
| `/vocabulary` | All course vocabulary |
| `/profile` | Stats, sign out, reset progress |

## Database setup

The app loads all course content from Supabase (no local fallback). You need **two SQL files** on a fresh project:

1. **`supabase/setup.sql`** — schema, RLS, base seed
2. **`supabase/migrations/20260701000000_expand_course_content.sql`** — full 117-lesson Starter + HSK 1 course (~278 vocab, ~2,200 exercises)

Optionally run **`supabase/migrations/20260702000000_add_progress_unique_constraints.sql`** if progress upserts fail (see troubleshooting below).

See **`supabase/COURSE_SETUP.md`** for details on regenerating content from TypeScript source files.

### Environment variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Use the **Project URL** from Supabase Dashboard → Settings → API. Do **not** include `/rest/v1`.

Google OAuth credentials go in the **Supabase Dashboard** (Authentication → Providers → Google), not in `.env`.

### Google sign-in setup

1. **Supabase Dashboard** → Authentication → Providers → **Google** → Enable.
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Application type: Web application
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Paste the Google **Client ID** and **Client Secret** into Supabase.
4. **Supabase Dashboard** → Authentication → URL Configuration → add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-production-domain/auth/callback`

### Troubleshooting

**Progress won't save** — "no unique or exclusion constraint matching the ON CONFLICT specification":

Run `supabase/migrations/20260702000000_add_progress_unique_constraints.sql` in the SQL Editor (skip statements that error with "already exists").

**Only 10 lessons showing** — you ran `setup.sql` but not the expand migration. Run `20260701000000_expand_course_content.sql`.

**Listening audio sounds wrong** — listening exercises use your browser's built-in Mandarin voice. Chrome and Safari pick different voices; tap the replay button if needed. For best results on macOS, enable Chinese voices in System Settings → Accessibility → Spoken Content.

---

## Hosting on Vercel (free)

This walkthrough deploys Lexloop for free using **Vercel** (hosting) + **Supabase** (database + auth).

### Step 1 — Push code to GitHub

```bash
git add .
git commit -m "Prepare Lexloop for deployment"
git push -u origin main
```

If you don't have a remote yet, create a repo on GitHub and follow its push instructions.

### Step 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project** (free tier).
2. Wait for the project to finish provisioning.
3. Open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3 — Load the database

In the Supabase **SQL Editor**, run these files **in order**:

1. Paste and run the entire contents of `supabase/setup.sql`
2. Paste and run the entire contents of `supabase/migrations/20260701000000_expand_course_content.sql`
3. Paste and run `supabase/migrations/20260702000000_add_progress_unique_constraints.sql`

Verify in **Table Editor** → `lessons` — you should see ~117 rows.

### Step 4 — Configure Google OAuth

1. **Supabase** → Authentication → Providers → **Google** → Enable.
2. **Google Cloud Console** → APIs & Services → Credentials → Create OAuth client ID (Web application).
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Paste Client ID + Secret into Supabase Google provider settings.
4. **Supabase** → Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (change to production URL after deploy)
   - Redirect URLs: add `http://localhost:3000/auth/callback` now; add production URL in Step 6.

### Step 5 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your GitHub repo.
2. Framework preset should auto-detect **Next.js**.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Wait for the build to finish (~2 min).
5. Copy your production URL (e.g. `https://lexloop.vercel.app`).

### Step 6 — Wire up production OAuth

1. **Supabase** → Authentication → URL Configuration:
   - Set **Site URL** to `https://your-app.vercel.app`
   - Add redirect URL: `https://your-app.vercel.app/auth/callback`
2. Redeploy on Vercel only if you changed env vars (OAuth URLs are Supabase-side).

### Step 7 — Smoke test

1. Open your production URL.
2. Click **Start learning** → sign in with Google.
3. Complete one lesson.
4. Refresh the page — XP and streak should persist.
5. Open **Review** and **Vocabulary** to confirm content loaded.

### Optional — custom domain

In Vercel → Project → **Settings → Domains**, add your domain. Then update Supabase redirect URLs and Site URL to match.

---

## CI

GitHub Actions runs `npm run lint` and `npm run build` on push/PR to `main` or `master`. See `.github/workflows/ci.yml`.

## Tech Stack

- Next.js 15 (App Router)
- React 19, TypeScript
- Tailwind CSS
- Supabase (Postgres, auth, RLS)
- Browser Speech Synthesis API (`zh-CN`) for listening exercises

## Progress Storage

Progress is stored per user in Supabase: `user_progress`, `lesson_attempts`, and `vocab_memory`.

## Regenerate SQL after content changes

```bash
npm run db:generate-seed
```

Then re-run the relevant SQL file(s) in the Supabase SQL Editor.
