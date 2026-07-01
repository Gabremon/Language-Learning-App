-- Hanzi Path — Supabase schema (optional; app works with local seed data)

create extension if not exists "uuid-ossp";

create table courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  language_code text not null,
  created_at timestamptz default now()
);

create table units (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  order_index int not null
);

create table lessons (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid references units(id) on delete cascade,
  title text not null,
  order_index int not null
);

create table vocab_items (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade,
  hanzi text not null,
  pinyin text not null,
  english text not null,
  part_of_speech text,
  difficulty int default 1,
  audio_url text,
  created_at timestamptz default now()
);

create table lesson_vocab (
  lesson_id uuid references lessons(id) on delete cascade,
  vocab_item_id uuid references vocab_items(id) on delete cascade,
  primary key (lesson_id, vocab_item_id)
);

create table sentences (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade,
  hanzi text not null,
  pinyin text not null,
  english text not null,
  difficulty int default 1,
  grammar_notes text
);

create table lesson_sentences (
  lesson_id uuid references lessons(id) on delete cascade,
  sentence_id uuid references sentences(id) on delete cascade,
  primary key (lesson_id, sentence_id)
);

create table exercises (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid references lessons(id) on delete cascade,
  type text not null,
  prompt text not null,
  payload_json jsonb not null,
  order_index int not null
);

create table user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  course_id uuid references courses(id) on delete cascade,
  current_unit_id uuid references units(id),
  current_lesson_id uuid references lessons(id),
  xp int default 0,
  streak_count int default 0,
  last_active_date date
);

create table lesson_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  lesson_id uuid references lessons(id) on delete cascade,
  score int not null,
  total_questions int not null,
  completed_at timestamptz default now()
);

create table exercise_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  exercise_id uuid references exercises(id) on delete cascade,
  is_correct boolean not null,
  user_answer text,
  correct_answer text,
  created_at timestamptz default now()
);

create table vocab_memory (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  vocab_item_id uuid references vocab_items(id) on delete cascade,
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
