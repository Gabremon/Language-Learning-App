# Course Content Setup

## Fresh database

1. Run **`supabase/setup.sql`** in the Supabase SQL Editor (schema + original 3-unit seed + RLS)
2. Run **`supabase/migrations/20260701000000_expand_course_content.sql`** (expanded 6-unit course)

## Existing database (already ran setup.sql)

Run only the migration:

```
supabase/migrations/20260701000000_expand_course_content.sql
```

This migration:
- Adds `image_url` and `emoji` columns to `vocab_items`
- Replaces the original 10-lesson course with 28 lessons across 6 units
- Loads 531 template-generated exercises with images and emoji
- Resets `user_progress` lesson pointers to the new first lesson

## Regenerate SQL after editing content

```bash
npm run db:generate-seed
```

Outputs:
- `supabase/setup.sql` — from `src/data/base-seed.ts` (unchanged original seed)
- `supabase/migrations/20260701000000_expand_course_content.sql` — from `src/data/course-content.ts`

## Content source files

| File | Purpose |
|------|---------|
| `src/data/base-seed.ts` | Original 3-unit / 10-lesson seed (setup.sql only) |
| `src/data/course-content.ts` | Expanded 6-unit / 28-lesson course |
| `src/data/seed.ts` | Wires expanded content + lesson generator |
| `src/lib/lesson-generator.ts` | Progressive exercise algorithm |
