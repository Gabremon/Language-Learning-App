# Course Content Setup

## Fresh database

1. Run **`supabase/setup.sql`** in the Supabase SQL Editor (schema + RLS)
2. Run **`supabase/migrations/20260701000000_expand_course_content.sql`** (full Starter + HSK 1 course)

## Existing database (already ran setup.sql)

Run only the migration:

```
supabase/migrations/20260701000000_expand_course_content.sql
```

This migration:
- Adds `image_url` and `emoji` columns to `vocab_items`
- Replaces course content with **117 lessons** across **21 units** (20 Starter + 97 HSK 1)
- Loads **278 vocabulary items** covering the full HSK 1 word list (274 core words + starter extras)
- Loads ~2,200+ template-generated exercises (4 words per micro-lesson + unit reviews)
- Resets `user_progress` lesson pointers

**If you still see 28 or 70 lessons**, your database has an older version of this migration. Re-run the file above in the Supabase SQL Editor.

## Regenerate SQL after editing content

```bash
npm run db:generate-seed
```

Outputs:
- `supabase/setup.sql` — from `src/data/base-seed.ts` (original 10-lesson seed for fresh schema)
- `supabase/migrations/20260701000000_expand_course_content.sql` — from `src/data/starter-hsk1/`

## Content source files

| File | Purpose |
|------|---------|
| `src/data/starter-hsk1/hsk1-vocab-data.ts` | Full HSK 1 vocabulary (274 words, 19 thematic units) |
| `src/data/starter-hsk1/build-catalog.ts` | Auto-generates HSK 1 micro-lessons from vocab |
| `src/data/starter-hsk1/starter-lessons.ts` | 20 hand-authored starter lessons |
| `src/data/starter-hsk1/units.ts` | 21 units in 2 sections (Starter + HSK 1) |
| `src/data/starter-hsk1/vocab.ts` | All vocabulary items for app + seed |
| `src/data/course-content.ts` | Re-exports for app + seed generator |
| `src/data/seed.ts` | Wires content + lesson generator |
| `src/lib/lesson-generator.ts` | Progressive exercise algorithm |

## Course structure

### Sections

| Section | Units | Lessons | Coverage |
|---------|-------|---------|----------|
| **Starter** | 2 | 20 | Pinyin, tones, survival phrases |
| **HSK 1** | 19 | 97 | Complete HSK 1 vocabulary + graduation |
| **Total** | **21** | **117** | |

### HSK 1 units (complete coverage)

Social Chinese · People & Pronouns · Family & Pets · Numbers & Measures · Time & Calendar · Daily Routine · Food · Drinks · Restaurants · Shopping · Money & Prices · Places in Town · Directions & Location · Transport & Travel · Weather · Home & Objects · Common Verbs · Descriptions · HSK 1 Graduation

Each unit has 4–6 micro-lessons (4 words each) plus a unit review lesson.
