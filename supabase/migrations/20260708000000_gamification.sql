-- Gamification: XP ledger, quests, achievements, cosmetics

create table if not exists xp_ledger (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  amount int not null,
  label text not null,
  meta_json jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_xp_ledger_user_created on xp_ledger(user_id, created_at desc);

create table if not exists user_gamification (
  user_id uuid primary key references auth.users(id) on delete cascade,
  earned_achievements text[] default '{}',
  unlocked_cosmetics text[] default '{}',
  equipped_cosmetic text,
  gauntlet_best_score int default 0,
  total_reviews_correct int default 0,
  perfect_lessons int default 0,
  quest_activity_json jsonb default '{}',
  daily_quests_json jsonb default '[]',
  weekly_quest_json jsonb default '{}',
  last_daily_reset date,
  last_weekly_reset date,
  updated_at timestamptz default now()
);

alter table xp_ledger enable row level security;
alter table user_gamification enable row level security;

create policy "Users read own xp ledger"
  on xp_ledger for select
  using (auth.uid() = user_id);

create policy "Users insert own xp ledger"
  on xp_ledger for insert
  with check (auth.uid() = user_id);

create policy "Users read own gamification"
  on user_gamification for select
  using (auth.uid() = user_id);

create policy "Users upsert own gamification"
  on user_gamification for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
