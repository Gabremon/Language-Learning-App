# HSK 2–6 migrations are **generated locally** — they are NOT applied automatically.

`npm run db:generate-hsk` writes SQL files to `supabase/migrations/`. You must **run each file in the Supabase SQL Editor** (or via Supabase CLI) to load content into your database.

## Apply HSK 2–6 to Supabase

The SQL Editor rejects files over ~1 MB. Use a **direct Postgres connection** instead:

### Step 1 — Get your database URL

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings** → **Database**
2. Under **Connection string**, choose **URI** and **Direct connection** (port `5432`)
3. Copy the string and replace `[YOUR-PASSWORD]` with your database password
4. Add to `.env`:

```
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Step 2 — Run from your project

```bash
npm install          # installs pg (dev dependency)
npm run db:apply-hsk
```

This connects directly to Postgres and applies each HSK migration in batches (~1–2 min total).

Apply a single file:

```bash
npm run db:apply-migration -- supabase/migrations/20260703000000_hsk2.sql
```

### Verify

```sql
select count(*) from units;    -- expect 45
select count(*) from lessons;  -- expect ~869
```

### Alternative: psql (if installed)

```bash
export DATABASE_URL="postgresql://..."
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20260703000000_hsk2.sql
# repeat for hsk3 … hsk6
```

### SQL Editor (small files only)

Only works if each file is under the editor size limit. `npm run db:generate-hsk` produces ~1.1 MB files — too large. Use `db:apply-hsk` instead.

---

## Fresh database

1. Run **`supabase/setup.sql`** in the Supabase SQL Editor (schema + RLS)
2. Run **`supabase/migrations/20260701000000_expand_course_content.sql`** (Starter + HSK 1)
3. Run HSK migrations **in order**:
   - `20260702000000_add_progress_unique_constraints.sql`
   - `20260703000000_hsk2.sql`
   - `20260704000000_hsk3.sql`
   - `20260705000000_hsk4.sql`
   - `20260706000000_hsk5.sql`
   - `20260707000000_hsk6.sql`

## Existing database (already has Starter + HSK 1)

Run only the migrations you have not applied yet, in timestamp order.

## Regenerate SQL after editing content

```bash
# Starter + HSK 1 (replaces expand_course_content migration)
npm run db:generate-seed

# HSK 2–6 (incremental migrations)
npm run db:generate-hsk
```

Outputs:
- `supabase/setup.sql` — from `src/data/base-seed.ts` (original 10-lesson seed)
- `supabase/migrations/20260701000000_expand_course_content.sql` — Starter + HSK 1
- `supabase/migrations/20260703000000_hsk2.sql` … `20260707000000_hsk6.sql` — one per HSK band

## Content source files

| File | Purpose |
|------|---------|
| `src/data/starter-hsk1/` | Starter + HSK 1 vocabulary, units, lessons |
| `src/data/generated/hsk2.ts` … `hsk6.ts` | Auto-generated HSK 2–6 content |
| `src/data/generated/hsk-advanced.ts` | Aggregates HSK 2–6 for the app |
| `src/data/course-content.ts` | Merged course data for app + seed |
| `scripts/hsk-unit-plans.ts` | Unit themes from curriculum plan |
| `scripts/generate-hsk-content.ts` | HSK 2–6 generator (vocab + migrations) |
| `src/lib/lesson-generator.ts` | Progressive exercise algorithm |

## Course structure

### Sections

| Section | Units | Lessons | Coverage |
|---------|-------|---------|----------|
| **Starter** | 2 | 20 | Pinyin, tones, survival phrases |
| **HSK 1** | 19 | 97 | Full HSK 1 vocabulary + graduation |
| **HSK 2** | 4 | ~155 | Home, health, travel, school/work |
| **HSK 3** | 5 | ~166 | Community, experience, plans, culture |
| **HSK 4** | 5 | ~145 | Housing, career, tech, narration |
| **HSK 5** | 5 | ~139 | Business, society, science, arts |
| **HSK 6** | 5 | ~147 | Academic, law, media, mastery |
| **Total** | **45** | **~869** | |

Vocabulary sourced from HSK 3.0 word lists (drkameleon/complete-hsk-vocabulary), assigned to thematic units per `curriculum/COURSE_PLAN.md` (HSK 2–4) with extended themes for HSK 5–6.
