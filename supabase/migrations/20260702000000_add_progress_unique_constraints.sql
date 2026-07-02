-- Required for progress upserts (ON CONFLICT user_id,course_id / user_id,vocab_item_id).
-- Safe to run on databases created before these constraints were added.

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'user_progress_user_course_unique'
  ) then
    alter table user_progress
      add constraint user_progress_user_course_unique unique (user_id, course_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'vocab_memory_user_vocab_unique'
  ) then
    alter table vocab_memory
      add constraint vocab_memory_user_vocab_unique unique (user_id, vocab_item_id);
  end if;
end $$;
