/**
 * Generates supabase/setup.sql — full schema, seed data, and RLS in one file.
 * Run: npm run db:generate-seed
 */
import { writeFileSync } from "fs";
import { join } from "path";
import {
  course,
  units,
  lessons,
  vocabItems,
  sentences,
  lessonVocabMap,
  lessonSentenceMap,
  exercises,
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

function buildSeedSql(): string {
  const lines: string[] = [
    "insert into courses (id, title, language_code) values",
    `  (${sqlStr(course.id)}, ${sqlStr(course.title)}, ${sqlStr(course.languageCode)});`,
    "",
    "insert into units (id, course_id, title, order_index) values",
    units
      .map(
        (u) =>
          `  (${sqlStr(u.id)}, ${sqlStr(u.courseId)}, ${sqlStr(u.title)}, ${u.orderIndex})`
      )
      .join(",\n") + ";",
    "",
    "insert into lessons (id, unit_id, title, order_index) values",
    lessons
      .map(
        (l) =>
          `  (${sqlStr(l.id)}, ${sqlStr(l.unitId)}, ${sqlStr(l.title)}, ${l.orderIndex})`
      )
      .join(",\n") + ";",
    "",
    "insert into vocab_items (id, course_id, hanzi, pinyin, english, part_of_speech, difficulty) values",
    vocabItems
      .map(
        (v) =>
          `  (${sqlStr(v.id)}, ${sqlStr(v.courseId)}, ${sqlStr(v.hanzi)}, ${sqlStr(v.pinyin)}, ${sqlStr(v.english)}, ${sqlStr(v.partOfSpeech)}, ${v.difficulty})`
      )
      .join(",\n") + ";",
    "",
    "insert into lesson_vocab (lesson_id, vocab_item_id) values",
    Object.entries(lessonVocabMap)
      .flatMap(([lessonId, vocabIds]) =>
        vocabIds.map((vocabId) => `  (${sqlStr(lessonId)}, ${sqlStr(vocabId)})`)
      )
      .join(",\n") + ";",
    "",
    "insert into sentences (id, course_id, hanzi, pinyin, english, difficulty, grammar_notes) values",
    sentences
      .map(
        (s) =>
          `  (${sqlStr(s.id)}, ${sqlStr(s.courseId)}, ${sqlStr(s.hanzi)}, ${sqlStr(s.pinyin)}, ${sqlStr(s.english)}, ${s.difficulty}, ${sqlNullable(s.grammarNotes)})`
      )
      .join(",\n") + ";",
    "",
  ];

  const lessonSentenceRows = Object.entries(lessonSentenceMap).flatMap(
    ([lessonId, sentenceIds]) =>
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
    exercises
      .map(
        (e) =>
          `  (${sqlStr(e.id)}, ${sqlStr(e.lessonId)}, ${sqlStr(e.type)}, ${sqlStr(e.prompt)}, ${sqlJson(e.payload)}, ${sqlNullable(e.explanation)}, ${e.orderIndex})`
      )
      .join(",\n") + ";"
  );

  return lines.join("\n");
}

const output = [
  "-- Hanzi Path — full Supabase setup (schema + seed + RLS)",
  "-- Generated from src/data/seed.ts — run: npm run db:generate-seed",
  "-- WARNING: Drops ALL tables in the public schema before recreating. All public data is lost.",
  "",
  "-- ========== RESET ==========",
  DROP_ALL_PUBLIC_TABLES.trim(),
  "",
  "-- ========== SCHEMA ==========",
  SCHEMA_SQL.trim(),
  "",
  "-- ========== SEED DATA ==========",
  buildSeedSql(),
  "",
  "-- ========== ROW LEVEL SECURITY ==========",
  RLS_SQL.trim(),
  "",
].join("\n");

const outPath = join(process.cwd(), "supabase/setup.sql");
writeFileSync(outPath, output, "utf8");

console.log(`Wrote supabase/setup.sql (${exercises.length} exercises)`);
