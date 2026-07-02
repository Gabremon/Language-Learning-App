/**
 * Generates:
 *   - supabase/setup.sql          (schema + original seed + RLS)
 *   - supabase/migrations/20260701000000_expand_course_content.sql
 *
 * Run: npm run db:generate-seed
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import {
  course as baseCourse,
  units as baseUnits,
  lessons as baseLessons,
  vocabItems as baseVocabItems,
  sentences as baseSentences,
  lessonVocabMap as baseLessonVocabMap,
  lessonSentenceMap as baseLessonSentenceMap,
  exercises as baseExercises,
} from "../src/data/base-seed";
import {
  course,
  units,
  lessons,
  vocabItems,
  sentences,
  lessonVocabMap,
  lessonSentenceMap,
  exercises,
  COURSE_ID,
} from "../src/data/seed";

function sqlStr(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlNullable(value: string | undefined | null): string {
  return value == null || value === "" ? "null" : sqlStr(value);
}

function sqlJson(value: unknown): string {
  return `${sqlStr(JSON.stringify(value))}::jsonb`;
}

const SCHEMA_SQL = `
create extension if not exists "uuid-ossp";

create table courses (
  id text primary key,
  title text not null,
  language_code text not null,
  created_at timestamptz default now()
);

create table units (
  id text primary key,
  course_id text references courses(id) on delete cascade,
  title text not null,
  order_index int not null
);

create table lessons (
  id text primary key,
  unit_id text references units(id) on delete cascade,
  title text not null,
  order_index int not null
);

create table vocab_items (
  id text primary key,
  course_id text references courses(id) on delete cascade,
  hanzi text not null,
  pinyin text not null,
  english text not null,
  part_of_speech text,
  difficulty int default 1,
  audio_url text,
  created_at timestamptz default now()
);

create table lesson_vocab (
  lesson_id text references lessons(id) on delete cascade,
  vocab_item_id text references vocab_items(id) on delete cascade,
  primary key (lesson_id, vocab_item_id)
);

create table sentences (
  id text primary key,
  course_id text references courses(id) on delete cascade,
  hanzi text not null,
  pinyin text not null,
  english text not null,
  difficulty int default 1,
  grammar_notes text
);

create table lesson_sentences (
  lesson_id text references lessons(id) on delete cascade,
  sentence_id text references sentences(id) on delete cascade,
  primary key (lesson_id, sentence_id)
);

create table exercises (
  id text primary key,
  lesson_id text references lessons(id) on delete cascade,
  type text not null,
  prompt text not null,
  payload_json jsonb not null,
  explanation text,
  order_index int not null
);

create table user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text references courses(id) on delete cascade,
  current_unit_id text references units(id),
  current_lesson_id text references lessons(id),
  xp int default 0,
  streak_count int default 0,
  last_active_date date,
  unique (user_id, course_id)
);

create table lesson_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text references lessons(id) on delete cascade,
  score int not null,
  total_questions int not null,
  completed_at timestamptz default now()
);

create table exercise_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text references exercises(id) on delete cascade,
  is_correct boolean not null,
  user_answer text,
  correct_answer text,
  created_at timestamptz default now()
);

create table vocab_memory (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocab_item_id text references vocab_items(id) on delete cascade,
  strength int default 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  times_seen int default 0,
  times_correct int default 0,
  unique (user_id, vocab_item_id)
);

create index idx_vocab_memory_user_next on vocab_memory(user_id, next_review_at);
create index idx_lessons_unit on lessons(unit_id, order_index);
create index idx_exercises_lesson on exercises(lesson_id, order_index);
`;

const RLS_SQL = `
alter table courses enable row level security;
alter table units enable row level security;
alter table lessons enable row level security;
alter table vocab_items enable row level security;
alter table lesson_vocab enable row level security;
alter table sentences enable row level security;
alter table lesson_sentences enable row level security;
alter table exercises enable row level security;
alter table user_progress enable row level security;
alter table lesson_attempts enable row level security;
alter table exercise_attempts enable row level security;
alter table vocab_memory enable row level security;

create policy "courses_select" on courses for select using (true);
create policy "units_select" on units for select using (true);
create policy "lessons_select" on lessons for select using (true);
create policy "vocab_items_select" on vocab_items for select using (true);
create policy "lesson_vocab_select" on lesson_vocab for select using (true);
create policy "sentences_select" on sentences for select using (true);
create policy "lesson_sentences_select" on lesson_sentences for select using (true);
create policy "exercises_select" on exercises for select using (true);

create policy "user_progress_select" on user_progress
  for select using (auth.uid() = user_id);
create policy "user_progress_insert" on user_progress
  for insert with check (auth.uid() = user_id);
create policy "user_progress_update" on user_progress
  for update using (auth.uid() = user_id);
create policy "user_progress_delete" on user_progress
  for delete using (auth.uid() = user_id);

create policy "lesson_attempts_select" on lesson_attempts
  for select using (auth.uid() = user_id);
create policy "lesson_attempts_insert" on lesson_attempts
  for insert with check (auth.uid() = user_id);
create policy "lesson_attempts_update" on lesson_attempts
  for update using (auth.uid() = user_id);
create policy "lesson_attempts_delete" on lesson_attempts
  for delete using (auth.uid() = user_id);

create policy "exercise_attempts_select" on exercise_attempts
  for select using (auth.uid() = user_id);
create policy "exercise_attempts_insert" on exercise_attempts
  for insert with check (auth.uid() = user_id);
create policy "exercise_attempts_update" on exercise_attempts
  for update using (auth.uid() = user_id);
create policy "exercise_attempts_delete" on exercise_attempts
  for delete using (auth.uid() = user_id);

create policy "vocab_memory_select" on vocab_memory
  for select using (auth.uid() = user_id);
create policy "vocab_memory_insert" on vocab_memory
  for insert with check (auth.uid() = user_id);
create policy "vocab_memory_update" on vocab_memory
  for update using (auth.uid() = user_id);
create policy "vocab_memory_delete" on vocab_memory
  for delete using (auth.uid() = user_id);
`;

const DROP_ALL_PUBLIC_TABLES = `
-- Drop every table in the public schema (full reset)
do $$
declare
  r record;
begin
  for r in (
    select tablename
    from pg_tables
    where schemaname = 'public'
  ) loop
    execute format('drop table if exists public.%I cascade', r.tablename);
  end loop;
end $$;
`;

interface SeedSource {
  course: typeof baseCourse;
  units: typeof baseUnits;
  lessons: typeof baseLessons;
  vocabItems: typeof baseVocabItems;
  sentences: typeof baseSentences;
  lessonVocabMap: typeof baseLessonVocabMap;
  lessonSentenceMap: typeof baseLessonSentenceMap;
  exercises: typeof baseExercises;
  includeImages?: boolean;
}

function buildSeedSql(source: SeedSource, options?: { skipCourseInsert?: boolean }): string {
  const {
    course: c,
    units: u,
    lessons: l,
    vocabItems: v,
    sentences: s,
    lessonVocabMap: lvm,
    lessonSentenceMap: lsm,
    exercises: ex,
    includeImages = false,
  } = source;

  const lines: string[] = [];

  if (!options?.skipCourseInsert) {
    lines.push(
      "insert into courses (id, title, language_code) values",
      `  (${sqlStr(c.id)}, ${sqlStr(c.title)}, ${sqlStr(c.languageCode)});`,
      ""
    );
  }

  lines.push(
    "insert into units (id, course_id, title, order_index) values",
    u.map(
      (unit) =>
        `  (${sqlStr(unit.id)}, ${sqlStr(unit.courseId)}, ${sqlStr(unit.title)}, ${unit.orderIndex})`
    ).join(",\n") + ";",
    "",
    "insert into lessons (id, unit_id, title, order_index) values",
    l.map(
      (lesson) =>
        `  (${sqlStr(lesson.id)}, ${sqlStr(lesson.unitId)}, ${sqlStr(lesson.title)}, ${lesson.orderIndex})`
    ).join(",\n") + ";",
    ""
  );

  if (includeImages) {
    lines.push(
      "insert into vocab_items (id, course_id, hanzi, pinyin, english, part_of_speech, difficulty, image_url, emoji) values",
      v.map(
        (item) =>
          `  (${sqlStr(item.id)}, ${sqlStr(item.courseId)}, ${sqlStr(item.hanzi)}, ${sqlStr(item.pinyin)}, ${sqlStr(item.english)}, ${sqlStr(item.partOfSpeech)}, ${item.difficulty}, ${sqlNullable(item.imageUrl)}, ${sqlNullable(item.emoji)})`
      ).join(",\n") + ";"
    );
  } else {
    lines.push(
      "insert into vocab_items (id, course_id, hanzi, pinyin, english, part_of_speech, difficulty) values",
      v.map(
        (item) =>
          `  (${sqlStr(item.id)}, ${sqlStr(item.courseId)}, ${sqlStr(item.hanzi)}, ${sqlStr(item.pinyin)}, ${sqlStr(item.english)}, ${sqlStr(item.partOfSpeech)}, ${item.difficulty})`
      ).join(",\n") + ";"
    );
  }

  lines.push(
    "",
    "insert into lesson_vocab (lesson_id, vocab_item_id) values",
    Object.entries(lvm)
      .flatMap(([lessonId, vocabIds]) =>
        vocabIds.map((vocabId) => `  (${sqlStr(lessonId)}, ${sqlStr(vocabId)})`)
      )
      .join(",\n") + ";",
    "",
    "insert into sentences (id, course_id, hanzi, pinyin, english, difficulty, grammar_notes) values",
    s.map(
      (sentence) =>
        `  (${sqlStr(sentence.id)}, ${sqlStr(sentence.courseId)}, ${sqlStr(sentence.hanzi)}, ${sqlStr(sentence.pinyin)}, ${sqlStr(sentence.english)}, ${sentence.difficulty}, ${sqlNullable(sentence.grammarNotes)})`
    ).join(",\n") + ";",
    ""
  );

  const lessonSentenceRows = Object.entries(lsm).flatMap(([lessonId, sentenceIds]) =>
    sentenceIds.map(
      (sentenceId) => `  (${sqlStr(lessonId)}, ${sqlStr(sentenceId)})`
    )
  );

  if (lessonSentenceRows.length > 0) {
    lines.push(
      "insert into lesson_sentences (lesson_id, sentence_id) values",
      lessonSentenceRows.join(",\n") + ";",
      ""
    );
  }

  lines.push(
    "insert into exercises (id, lesson_id, type, prompt, payload_json, explanation, order_index) values",
    ex.map(
      (e) =>
        `  (${sqlStr(e.id)}, ${sqlStr(e.lessonId)}, ${sqlStr(e.type)}, ${sqlStr(e.prompt)}, ${sqlJson(e.payload)}, ${sqlNullable(e.explanation)}, ${e.orderIndex})`
    ).join(",\n") + ";"
  );

  return lines.join("\n");
}

function buildMigrationSql(): string {
  const firstLesson = lessons[0];
  const firstUnit = units[0];

  return [
    `-- Expand course content: Starter + HSK 1 (${lessons.length} lessons, ${exercises.length} exercises)`,
    "-- Generated from src/data/course-content.ts — run: npm run db:generate-seed",
    "-- Apply AFTER setup.sql on an existing database.",
    "",
    "-- ========== SCHEMA ADDITIONS ==========",
    "alter table vocab_items add column if not exists image_url text;",
    "alter table vocab_items add column if not exists emoji text;",
    "",
    "-- ========== CLEAR OLD COURSE CONTENT ==========",
    "-- Reset user pointers to avoid FK violations when lessons are replaced",
    `update user_progress`,
    `  set current_lesson_id = null,`,
    `      current_unit_id = null`,
    `  where course_id = ${sqlStr(COURSE_ID)};`,
    "",
    `delete from exercise_attempts`,
    `  where exercise_id in (`,
    `    select id from exercises`,
    `    where lesson_id in (select id from lessons where unit_id in (select id from units where course_id = ${sqlStr(COURSE_ID)}))`,
    `  );`,
    "",
    `delete from lesson_attempts`,
    `  where lesson_id in (select id from lessons where unit_id in (select id from units where course_id = ${sqlStr(COURSE_ID)}));`,
    "",
    `delete from vocab_memory`,
    `  where vocab_item_id in (select id from vocab_items where course_id = ${sqlStr(COURSE_ID)});`,
    "",
    `delete from exercises`,
    `  where lesson_id in (select id from lessons where unit_id in (select id from units where course_id = ${sqlStr(COURSE_ID)}));`,
    "",
    `delete from lesson_vocab`,
    `  where lesson_id in (select id from lessons where unit_id in (select id from units where course_id = ${sqlStr(COURSE_ID)}));`,
    "",
    `delete from lesson_sentences`,
    `  where lesson_id in (select id from lessons where unit_id in (select id from units where course_id = ${sqlStr(COURSE_ID)}));`,
    "",
    `delete from lessons`,
    `  where unit_id in (select id from units where course_id = ${sqlStr(COURSE_ID)});`,
    "",
    `delete from units where course_id = ${sqlStr(COURSE_ID)};`,
    "",
    `delete from sentences where course_id = ${sqlStr(COURSE_ID)};`,
    "",
    `delete from vocab_items where course_id = ${sqlStr(COURSE_ID)};`,
    "",
    "-- ========== INSERT EXPANDED COURSE CONTENT ==========",
    buildSeedSql(
      {
        course,
        units,
        lessons,
        vocabItems,
        sentences,
        lessonVocabMap,
        lessonSentenceMap,
        exercises,
        includeImages: true,
      },
      { skipCourseInsert: true }
    ),
    "",
    "-- ========== RESET USER PROGRESS POINTERS ==========",
    `update user_progress`,
    `  set current_lesson_id = ${sqlStr(firstLesson.id)},`,
    `      current_unit_id = ${sqlStr(firstUnit.id)}`,
    `  where course_id = ${sqlStr(COURSE_ID)}`,
    `    and current_lesson_id is null;`,
    "",
  ].join("\n");
}

// --- Write setup.sql (original schema + original seed + RLS) ---
const setupOutput = [
  "-- Hanzi Path — full Supabase setup (schema + seed + RLS)",
  "-- Generated from src/data/base-seed.ts — run: npm run db:generate-seed",
  "-- WARNING: Drops ALL tables in the public schema before recreating. All public data is lost.",
  "",
  "-- ========== RESET ==========",
  DROP_ALL_PUBLIC_TABLES.trim(),
  "",
  "-- ========== SCHEMA ==========",
  SCHEMA_SQL.trim(),
  "",
  "-- ========== SEED DATA ==========",
  buildSeedSql({
    course: baseCourse,
    units: baseUnits,
    lessons: baseLessons,
    vocabItems: baseVocabItems,
    sentences: baseSentences,
    lessonVocabMap: baseLessonVocabMap,
    lessonSentenceMap: baseLessonSentenceMap,
    exercises: baseExercises,
    includeImages: false,
  }),
  "",
  "-- ========== ROW LEVEL SECURITY ==========",
  RLS_SQL.trim(),
  "",
].join("\n");

const migrationsDir = join(process.cwd(), "supabase/migrations");
mkdirSync(migrationsDir, { recursive: true });

const migrationPath = join(migrationsDir, "20260701000000_expand_course_content.sql");
const setupPath = join(process.cwd(), "supabase/setup.sql");

writeFileSync(setupPath, setupOutput, "utf8");
writeFileSync(migrationPath, buildMigrationSql(), "utf8");

console.log(`Wrote supabase/setup.sql (${baseExercises.length} exercises — original seed)`);
console.log(`Wrote supabase/migrations/20260701000000_expand_course_content.sql (${exercises.length} exercises)`);
