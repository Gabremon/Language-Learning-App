-- Hanzi Path — full Supabase setup (schema + seed + RLS)
-- Generated from src/data/seed.ts — run: npm run db:generate-seed
-- WARNING: Drops ALL tables in the public schema before recreating. All public data is lost.

-- ========== RESET ==========
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

-- ========== SCHEMA ==========
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

-- ========== SEED DATA ==========
insert into courses (id, title, language_code) values
  ('course-mandarin-1', 'Mandarin Chinese', 'zh-CN');

insert into units (id, course_id, title, order_index) values
  ('unit-1', 'course-mandarin-1', 'Basics', 1),
  ('unit-2', 'course-mandarin-1', 'Food', 2),
  ('unit-3', 'course-mandarin-1', 'Family', 3);

insert into lessons (id, unit_id, title, order_index) values
  ('lesson-1-1', 'unit-1', 'I, you, he/she, to be', 1),
  ('lesson-1-2', 'unit-1', 'Students and teachers', 2),
  ('lesson-1-3', 'unit-1', 'Countries and nationalities', 3),
  ('lesson-1-4', 'unit-1', 'Yes/no questions', 4),
  ('lesson-2-1', 'unit-2', 'Water, tea, rice, noodles', 1),
  ('lesson-2-2', 'unit-2', 'Like and dislike', 2),
  ('lesson-2-3', 'unit-2', 'Ordering food', 3),
  ('lesson-3-1', 'unit-3', 'Mom, dad, siblings', 1),
  ('lesson-3-2', 'unit-3', 'My family', 2),
  ('lesson-3-3', 'unit-3', 'Simple descriptions', 3);

insert into vocab_items (id, course_id, hanzi, pinyin, english, part_of_speech, difficulty) values
  ('v-wo', 'course-mandarin-1', '我', 'wǒ', 'I / me', 'pronoun', 1),
  ('v-ni', 'course-mandarin-1', '你', 'nǐ', 'you', 'pronoun', 1),
  ('v-ta-he', 'course-mandarin-1', '他', 'tā', 'he / him', 'pronoun', 1),
  ('v-ta-she', 'course-mandarin-1', '她', 'tā', 'she / her', 'pronoun', 1),
  ('v-shi', 'course-mandarin-1', '是', 'shì', 'to be', 'verb', 1),
  ('v-xuesheng', 'course-mandarin-1', '学生', 'xuéshēng', 'student', 'noun', 1),
  ('v-laoshi', 'course-mandarin-1', '老师', 'lǎoshī', 'teacher', 'noun', 1),
  ('v-tongxue', 'course-mandarin-1', '同学', 'tóngxué', 'classmate', 'noun', 2),
  ('v-xuexiao', 'course-mandarin-1', '学校', 'xuéxiào', 'school', 'noun', 2),
  ('v-zhongguo', 'course-mandarin-1', '中国', 'Zhōngguó', 'China', 'noun', 1),
  ('v-meiguo', 'course-mandarin-1', '美国', 'Měiguó', 'United States', 'noun', 1),
  ('v-ren', 'course-mandarin-1', '人', 'rén', 'person', 'noun', 1),
  ('v-zhongguoren', 'course-mandarin-1', '中国人', 'Zhōngguórén', 'Chinese person', 'noun', 2),
  ('v-ma', 'course-mandarin-1', '吗', 'ma', 'question particle', 'particle', 2),
  ('v-bu', 'course-mandarin-1', '不', 'bù', 'not / no', 'adverb', 1),
  ('v-hao', 'course-mandarin-1', '好', 'hǎo', 'good', 'adjective', 1),
  ('v-shui', 'course-mandarin-1', '水', 'shuǐ', 'water', 'noun', 1),
  ('v-cha', 'course-mandarin-1', '茶', 'chá', 'tea', 'noun', 1),
  ('v-mifan', 'course-mandarin-1', '米饭', 'mǐfàn', 'rice', 'noun', 1),
  ('v-miantiao', 'course-mandarin-1', '面条', 'miàntiáo', 'noodles', 'noun', 2),
  ('v-xihuan', 'course-mandarin-1', '喜欢', 'xǐhuān', 'to like', 'verb', 1),
  ('v-buxihuan', 'course-mandarin-1', '不喜欢', 'bù xǐhuān', 'to not like', 'verb', 2),
  ('v-qing', 'course-mandarin-1', '请', 'qǐng', 'please', 'verb', 1),
  ('v-yao', 'course-mandarin-1', '要', 'yào', 'to want', 'verb', 1),
  ('v-chi', 'course-mandarin-1', '吃', 'chī', 'to eat', 'verb', 1),
  ('v-he', 'course-mandarin-1', '喝', 'hē', 'to drink', 'verb', 1),
  ('v-mama', 'course-mandarin-1', '妈妈', 'māma', 'mom', 'noun', 1),
  ('v-baba', 'course-mandarin-1', '爸爸', 'bàba', 'dad', 'noun', 1),
  ('v-gege', 'course-mandarin-1', '哥哥', 'gēge', 'older brother', 'noun', 1),
  ('v-meimei', 'course-mandarin-1', '妹妹', 'mèimei', 'younger sister', 'noun', 1),
  ('v-jia', 'course-mandarin-1', '家', 'jiā', 'family / home', 'noun', 1),
  ('v-de', 'course-mandarin-1', '的', 'de', 'possessive particle', 'particle', 2),
  ('v-hen', 'course-mandarin-1', '很', 'hěn', 'very', 'adverb', 1),
  ('v-da', 'course-mandarin-1', '大', 'dà', 'big', 'adjective', 1),
  ('v-xiao', 'course-mandarin-1', '小', 'xiǎo', 'small', 'adjective', 1);

insert into lesson_vocab (lesson_id, vocab_item_id) values
  ('lesson-1-1', 'v-wo'),
  ('lesson-1-1', 'v-ni'),
  ('lesson-1-1', 'v-ta-he'),
  ('lesson-1-1', 'v-ta-she'),
  ('lesson-1-1', 'v-shi'),
  ('lesson-1-2', 'v-xuesheng'),
  ('lesson-1-2', 'v-laoshi'),
  ('lesson-1-2', 'v-tongxue'),
  ('lesson-1-2', 'v-xuexiao'),
  ('lesson-1-2', 'v-shi'),
  ('lesson-1-3', 'v-zhongguo'),
  ('lesson-1-3', 'v-meiguo'),
  ('lesson-1-3', 'v-ren'),
  ('lesson-1-3', 'v-zhongguoren'),
  ('lesson-1-3', 'v-shi'),
  ('lesson-1-4', 'v-ma'),
  ('lesson-1-4', 'v-bu'),
  ('lesson-1-4', 'v-hao'),
  ('lesson-1-4', 'v-shi'),
  ('lesson-1-4', 'v-ni'),
  ('lesson-2-1', 'v-shui'),
  ('lesson-2-1', 'v-cha'),
  ('lesson-2-1', 'v-mifan'),
  ('lesson-2-1', 'v-miantiao'),
  ('lesson-2-1', 'v-he'),
  ('lesson-2-2', 'v-xihuan'),
  ('lesson-2-2', 'v-buxihuan'),
  ('lesson-2-2', 'v-cha'),
  ('lesson-2-2', 'v-mifan'),
  ('lesson-2-2', 'v-chi'),
  ('lesson-2-3', 'v-qing'),
  ('lesson-2-3', 'v-yao'),
  ('lesson-2-3', 'v-chi'),
  ('lesson-2-3', 'v-he'),
  ('lesson-2-3', 'v-mifan'),
  ('lesson-3-1', 'v-mama'),
  ('lesson-3-1', 'v-baba'),
  ('lesson-3-1', 'v-gege'),
  ('lesson-3-1', 'v-meimei'),
  ('lesson-3-1', 'v-de'),
  ('lesson-3-2', 'v-jia'),
  ('lesson-3-2', 'v-de'),
  ('lesson-3-2', 'v-mama'),
  ('lesson-3-2', 'v-baba'),
  ('lesson-3-2', 'v-wo'),
  ('lesson-3-3', 'v-hen'),
  ('lesson-3-3', 'v-da'),
  ('lesson-3-3', 'v-xiao'),
  ('lesson-3-3', 'v-hao'),
  ('lesson-3-3', 'v-jia');

insert into sentences (id, course_id, hanzi, pinyin, english, difficulty, grammar_notes) values
  ('s-1', 'course-mandarin-1', '我是学生。', 'Wǒ shì xuéshēng.', 'I am a student.', 1, 'Subject + 是 + noun'),
  ('s-2', 'course-mandarin-1', '她是老师。', 'Tā shì lǎoshī.', 'She is a teacher.', 1, null),
  ('s-3', 'course-mandarin-1', '你是中国人吗？', 'Nǐ shì Zhōngguórén ma?', 'Are you Chinese?', 2, 'Add 吗 at the end for yes/no questions'),
  ('s-4', 'course-mandarin-1', '我喜欢喝茶。', 'Wǒ xǐhuān hē chá.', 'I like to drink tea.', 2, null),
  ('s-5', 'course-mandarin-1', '请给我米饭。', 'Qǐng gěi wǒ mǐfàn.', 'Please give me rice.', 2, null),
  ('s-6', 'course-mandarin-1', '我的妈妈很好。', 'Wǒ de māma hěn hǎo.', 'My mom is very good.', 2, '的 marks possession'),
  ('s-7', 'course-mandarin-1', '我家很大。', 'Wǒ jiā hěn dà.', 'My family/home is very big.', 2, null);

insert into lesson_sentences (lesson_id, sentence_id) values
  ('lesson-1-2', 's-1'),
  ('lesson-1-2', 's-2'),
  ('lesson-1-3', 's-3'),
  ('lesson-1-4', 's-3'),
  ('lesson-2-2', 's-4'),
  ('lesson-2-3', 's-5'),
  ('lesson-3-2', 's-6'),
  ('lesson-3-3', 's-7');

insert into exercises (id, lesson_id, type, prompt, payload_json, explanation, order_index) values
  ('lesson-1-1-ex-0', 'lesson-1-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"我\" mean?","options":["you","I / me","to be","she / her"],"correctAnswer":"I / me","displayHanzi":"我"}'::jsonb, '我 (wǒ) means "I / me".', 0),
  ('lesson-1-1-ex-1', 'lesson-1-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"我","pinyin":"wǒ","acceptedAnswers":["I / me","I"]}'::jsonb, '我 = I / me', 1),
  ('lesson-1-1-ex-2', 'lesson-1-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"我","options":["wǒ","nǐ","shì","tā"],"correctAnswer":"wǒ"}'::jsonb, '我 is pronounced wǒ.', 2),
  ('lesson-1-1-ex-3', 'lesson-1-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"wǒ","options":["她","我","你","是"],"correctAnswer":"我"}'::jsonb, 'wǒ → 我', 3),
  ('lesson-1-1-ex-4', 'lesson-1-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"你\" mean?","options":["you","to be","I / me","he / him"],"correctAnswer":"you","displayHanzi":"你"}'::jsonb, '你 (nǐ) means "you".', 4),
  ('lesson-1-1-ex-5', 'lesson-1-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"你","pinyin":"nǐ","acceptedAnswers":["you","you"]}'::jsonb, '你 = you', 5),
  ('lesson-1-1-ex-6', 'lesson-1-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"你","options":["shì","nǐ","wǒ","tā"],"correctAnswer":"nǐ"}'::jsonb, '你 is pronounced nǐ.', 6),
  ('lesson-1-1-ex-7', 'lesson-1-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"nǐ","options":["你","是","他","我"],"correctAnswer":"你"}'::jsonb, 'nǐ → 你', 7),
  ('lesson-1-1-ex-8', 'lesson-1-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"他\" mean?","options":["he / him","you","to be","she / her"],"correctAnswer":"he / him","displayHanzi":"他"}'::jsonb, '他 (tā) means "he / him".', 8),
  ('lesson-1-1-ex-9', 'lesson-1-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"他","pinyin":"tā","acceptedAnswers":["he / him","he"]}'::jsonb, '他 = he / him', 9),
  ('lesson-1-1-ex-10', 'lesson-1-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"他","options":["nǐ","shì","wǒ","tā"],"correctAnswer":"tā"}'::jsonb, '他 is pronounced tā.', 10),
  ('lesson-1-1-ex-11', 'lesson-1-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"tā","options":["他","是","她","你"],"correctAnswer":"他"}'::jsonb, 'tā → 他', 11),
  ('lesson-1-1-ex-12', 'lesson-1-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"她\" mean?","options":["I / me","she / her","he / him","to be"],"correctAnswer":"she / her","displayHanzi":"她"}'::jsonb, '她 (tā) means "she / her".', 12),
  ('lesson-1-1-ex-13', 'lesson-1-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"她","pinyin":"tā","acceptedAnswers":["she / her","she"]}'::jsonb, '她 = she / her', 13),
  ('lesson-1-2-ex-0', 'lesson-1-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"学生\" mean?","options":["teacher","student","school","to be"],"correctAnswer":"student","displayHanzi":"学生"}'::jsonb, '学生 (xuéshēng) means "student".', 0),
  ('lesson-1-2-ex-1', 'lesson-1-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"学生","pinyin":"xuéshēng","acceptedAnswers":["student","student"]}'::jsonb, '学生 = student', 1),
  ('lesson-1-2-ex-2', 'lesson-1-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"学生","options":["xuéshēng","xuéxiào","shì","tóngxué"],"correctAnswer":"xuéshēng"}'::jsonb, '学生 is pronounced xuéshēng.', 2),
  ('lesson-1-2-ex-3', 'lesson-1-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"xuéshēng","options":["学校","学生","老师","是"],"correctAnswer":"学生"}'::jsonb, 'xuéshēng → 学生', 3),
  ('lesson-1-2-ex-4', 'lesson-1-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"老师\" mean?","options":["teacher","to be","school","classmate"],"correctAnswer":"teacher","displayHanzi":"老师"}'::jsonb, '老师 (lǎoshī) means "teacher".', 4),
  ('lesson-1-2-ex-5', 'lesson-1-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"老师","pinyin":"lǎoshī","acceptedAnswers":["teacher","teacher"]}'::jsonb, '老师 = teacher', 5),
  ('lesson-1-2-ex-6', 'lesson-1-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"老师","options":["tóngxué","xuéshēng","xuéxiào","lǎoshī"],"correctAnswer":"lǎoshī"}'::jsonb, '老师 is pronounced lǎoshī.', 6),
  ('lesson-1-2-ex-7', 'lesson-1-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"lǎoshī","options":["老师","是","学校","同学"],"correctAnswer":"老师"}'::jsonb, 'lǎoshī → 老师', 7),
  ('lesson-1-2-ex-8', 'lesson-1-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"同学\" mean?","options":["to be","teacher","classmate","school"],"correctAnswer":"classmate","displayHanzi":"同学"}'::jsonb, '同学 (tóngxué) means "classmate".', 8),
  ('lesson-1-2-ex-9', 'lesson-1-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"同学","pinyin":"tóngxué","acceptedAnswers":["classmate","classmate"]}'::jsonb, '同学 = classmate', 9),
  ('lesson-1-2-ex-10', 'lesson-1-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"同学","options":["xuéshēng","lǎoshī","xuéxiào","tóngxué"],"correctAnswer":"tóngxué"}'::jsonb, '同学 is pronounced tóngxué.', 10),
  ('lesson-1-2-ex-11', 'lesson-1-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"tóngxué","options":["学校","是","同学","老师"],"correctAnswer":"同学"}'::jsonb, 'tóngxué → 同学', 11),
  ('lesson-1-2-ex-12', 'lesson-1-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"学校\" mean?","options":["classmate","school","student","to be"],"correctAnswer":"school","displayHanzi":"学校"}'::jsonb, '学校 (xuéxiào) means "school".', 12),
  ('lesson-1-2-ex-13', 'lesson-1-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"学校","pinyin":"xuéxiào","acceptedAnswers":["school","school"]}'::jsonb, '学校 = school', 13),
  ('lesson-1-3-ex-0', 'lesson-1-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"中国\" mean?","options":["to be","Chinese person","China","person"],"correctAnswer":"China","displayHanzi":"中国"}'::jsonb, '中国 (Zhōngguó) means "China".', 0),
  ('lesson-1-3-ex-1', 'lesson-1-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"中国","pinyin":"Zhōngguó","acceptedAnswers":["China","China"]}'::jsonb, '中国 = China', 1),
  ('lesson-1-3-ex-2', 'lesson-1-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"中国","options":["Měiguó","Zhōngguórén","rén","Zhōngguó"],"correctAnswer":"Zhōngguó"}'::jsonb, '中国 is pronounced Zhōngguó.', 2),
  ('lesson-1-3-ex-3', 'lesson-1-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"Zhōngguó","options":["是","人","中国","中国人"],"correctAnswer":"中国"}'::jsonb, 'Zhōngguó → 中国', 3),
  ('lesson-1-3-ex-4', 'lesson-1-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"美国\" mean?","options":["person","China","Chinese person","United States"],"correctAnswer":"United States","displayHanzi":"美国"}'::jsonb, '美国 (Měiguó) means "United States".', 4),
  ('lesson-1-3-ex-5', 'lesson-1-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"美国","pinyin":"Měiguó","acceptedAnswers":["United States","United States"]}'::jsonb, '美国 = United States', 5),
  ('lesson-1-3-ex-6', 'lesson-1-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"美国","options":["Měiguó","shì","rén","Zhōngguó"],"correctAnswer":"Měiguó"}'::jsonb, '美国 is pronounced Měiguó.', 6),
  ('lesson-1-3-ex-7', 'lesson-1-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"Měiguó","options":["人","中国人","中国","美国"],"correctAnswer":"美国"}'::jsonb, 'Měiguó → 美国', 7),
  ('lesson-1-3-ex-8', 'lesson-1-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"人\" mean?","options":["person","United States","to be","Chinese person"],"correctAnswer":"person","displayHanzi":"人"}'::jsonb, '人 (rén) means "person".', 8),
  ('lesson-1-3-ex-9', 'lesson-1-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"人","pinyin":"rén","acceptedAnswers":["person","person"]}'::jsonb, '人 = person', 9),
  ('lesson-1-3-ex-10', 'lesson-1-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"人","options":["Zhōngguó","Měiguó","Zhōngguórén","rén"],"correctAnswer":"rén"}'::jsonb, '人 is pronounced rén.', 10),
  ('lesson-1-3-ex-11', 'lesson-1-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"rén","options":["人","是","中国人","美国"],"correctAnswer":"人"}'::jsonb, 'rén → 人', 11),
  ('lesson-1-3-ex-12', 'lesson-1-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"中国人\" mean?","options":["China","person","United States","Chinese person"],"correctAnswer":"Chinese person","displayHanzi":"中国人"}'::jsonb, '中国人 (Zhōngguórén) means "Chinese person".', 12),
  ('lesson-1-3-ex-13', 'lesson-1-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"中国人","pinyin":"Zhōngguórén","acceptedAnswers":["Chinese person","Chinese person"]}'::jsonb, '中国人 = Chinese person', 13),
  ('lesson-1-4-ex-0', 'lesson-1-4', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"吗\" mean?","options":["question particle","to be","you","good"],"correctAnswer":"question particle","displayHanzi":"吗"}'::jsonb, '吗 (ma) means "question particle".', 0),
  ('lesson-1-4-ex-1', 'lesson-1-4', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"吗","pinyin":"ma","acceptedAnswers":["question particle","question particle"]}'::jsonb, '吗 = question particle', 1),
  ('lesson-1-4-ex-2', 'lesson-1-4', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"吗","options":["bù","shì","hǎo","ma"],"correctAnswer":"ma"}'::jsonb, '吗 is pronounced ma.', 2),
  ('lesson-1-4-ex-3', 'lesson-1-4', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"ma","options":["吗","好","你","是"],"correctAnswer":"吗"}'::jsonb, 'ma → 吗', 3),
  ('lesson-1-4-ex-4', 'lesson-1-4', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"不\" mean?","options":["question particle","not / no","to be","you"],"correctAnswer":"not / no","displayHanzi":"不"}'::jsonb, '不 (bù) means "not / no".', 4),
  ('lesson-1-4-ex-5', 'lesson-1-4', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"不","pinyin":"bù","acceptedAnswers":["not / no","not"]}'::jsonb, '不 = not / no', 5),
  ('lesson-1-4-ex-6', 'lesson-1-4', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"不","options":["bù","shì","nǐ","hǎo"],"correctAnswer":"bù"}'::jsonb, '不 is pronounced bù.', 6),
  ('lesson-1-4-ex-7', 'lesson-1-4', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"bù","options":["吗","不","是","你"],"correctAnswer":"不"}'::jsonb, 'bù → 不', 7),
  ('lesson-1-4-ex-8', 'lesson-1-4', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"好\" mean?","options":["you","to be","good","not / no"],"correctAnswer":"good","displayHanzi":"好"}'::jsonb, '好 (hǎo) means "good".', 8),
  ('lesson-1-4-ex-9', 'lesson-1-4', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"好","pinyin":"hǎo","acceptedAnswers":["good","good"]}'::jsonb, '好 = good', 9),
  ('lesson-1-4-ex-10', 'lesson-1-4', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"好","options":["ma","bù","shì","hǎo"],"correctAnswer":"hǎo"}'::jsonb, '好 is pronounced hǎo.', 10),
  ('lesson-1-4-ex-11', 'lesson-1-4', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"hǎo","options":["你","不","好","是"],"correctAnswer":"好"}'::jsonb, 'hǎo → 好', 11),
  ('lesson-1-4-ex-12', 'lesson-1-4', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"是\" mean?","options":["question particle","not / no","to be","you"],"correctAnswer":"to be","displayHanzi":"是"}'::jsonb, '是 (shì) means "to be".', 12),
  ('lesson-1-4-ex-13', 'lesson-1-4', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"是","pinyin":"shì","acceptedAnswers":["to be","to be"]}'::jsonb, '是 = to be', 13),
  ('lesson-2-1-ex-0', 'lesson-2-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"水\" mean?","options":["to drink","water","tea","noodles"],"correctAnswer":"water","displayHanzi":"水"}'::jsonb, '水 (shuǐ) means "water".', 0),
  ('lesson-2-1-ex-1', 'lesson-2-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"水","pinyin":"shuǐ","acceptedAnswers":["water","water"]}'::jsonb, '水 = water', 1),
  ('lesson-2-1-ex-2', 'lesson-2-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"水","options":["hē","mǐfàn","shuǐ","miàntiáo"],"correctAnswer":"shuǐ"}'::jsonb, '水 is pronounced shuǐ.', 2),
  ('lesson-2-1-ex-3', 'lesson-2-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"shuǐ","options":["茶","水","面条","喝"],"correctAnswer":"水"}'::jsonb, 'shuǐ → 水', 3),
  ('lesson-2-1-ex-4', 'lesson-2-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"茶\" mean?","options":["tea","noodles","to drink","rice"],"correctAnswer":"tea","displayHanzi":"茶"}'::jsonb, '茶 (chá) means "tea".', 4),
  ('lesson-2-1-ex-5', 'lesson-2-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"茶","pinyin":"chá","acceptedAnswers":["tea","tea"]}'::jsonb, '茶 = tea', 5),
  ('lesson-2-1-ex-6', 'lesson-2-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"茶","options":["mǐfàn","shuǐ","miàntiáo","chá"],"correctAnswer":"chá"}'::jsonb, '茶 is pronounced chá.', 6),
  ('lesson-2-1-ex-7', 'lesson-2-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"chá","options":["茶","面条","喝","米饭"],"correctAnswer":"茶"}'::jsonb, 'chá → 茶', 7),
  ('lesson-2-1-ex-8', 'lesson-2-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"米饭\" mean?","options":["noodles","rice","water","to drink"],"correctAnswer":"rice","displayHanzi":"米饭"}'::jsonb, '米饭 (mǐfàn) means "rice".', 8),
  ('lesson-2-1-ex-9', 'lesson-2-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"米饭","pinyin":"mǐfàn","acceptedAnswers":["rice","rice"]}'::jsonb, '米饭 = rice', 9),
  ('lesson-2-1-ex-10', 'lesson-2-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"米饭","options":["mǐfàn","hē","miàntiáo","chá"],"correctAnswer":"mǐfàn"}'::jsonb, '米饭 is pronounced mǐfàn.', 10),
  ('lesson-2-1-ex-11', 'lesson-2-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"mǐfàn","options":["面条","米饭","水","喝"],"correctAnswer":"米饭"}'::jsonb, 'mǐfàn → 米饭', 11),
  ('lesson-2-1-ex-12', 'lesson-2-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"面条\" mean?","options":["water","to drink","noodles","tea"],"correctAnswer":"noodles","displayHanzi":"面条"}'::jsonb, '面条 (miàntiáo) means "noodles".', 12),
  ('lesson-2-1-ex-13', 'lesson-2-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"面条","pinyin":"miàntiáo","acceptedAnswers":["noodles","noodles"]}'::jsonb, '面条 = noodles', 13),
  ('lesson-2-2-ex-0', 'lesson-2-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"喜欢\" mean?","options":["to like","to eat","tea","rice"],"correctAnswer":"to like","displayHanzi":"喜欢"}'::jsonb, '喜欢 (xǐhuān) means "to like".', 0),
  ('lesson-2-2-ex-1', 'lesson-2-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"喜欢","pinyin":"xǐhuān","acceptedAnswers":["to like","to like"]}'::jsonb, '喜欢 = to like', 1),
  ('lesson-2-2-ex-2', 'lesson-2-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"喜欢","options":["chá","bù xǐhuān","mǐfàn","xǐhuān"],"correctAnswer":"xǐhuān"}'::jsonb, '喜欢 is pronounced xǐhuān.', 2),
  ('lesson-2-2-ex-3', 'lesson-2-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"xǐhuān","options":["喜欢","米饭","吃","茶"],"correctAnswer":"喜欢"}'::jsonb, 'xǐhuān → 喜欢', 3),
  ('lesson-2-2-ex-4', 'lesson-2-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"不喜欢\" mean?","options":["to like","rice","to not like","to eat"],"correctAnswer":"to not like","displayHanzi":"不喜欢"}'::jsonb, '不喜欢 (bù xǐhuān) means "to not like".', 4),
  ('lesson-2-2-ex-5', 'lesson-2-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"不喜欢","pinyin":"bù xǐhuān","acceptedAnswers":["to not like","to not like"]}'::jsonb, '不喜欢 = to not like', 5),
  ('lesson-2-2-ex-6', 'lesson-2-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"不喜欢","options":["chī","mǐfàn","bù xǐhuān","chá"],"correctAnswer":"bù xǐhuān"}'::jsonb, '不喜欢 is pronounced bù xǐhuān.', 6),
  ('lesson-2-2-ex-7', 'lesson-2-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"bù xǐhuān","options":["喜欢","吃","不喜欢","米饭"],"correctAnswer":"不喜欢"}'::jsonb, 'bù xǐhuān → 不喜欢', 7),
  ('lesson-2-2-ex-8', 'lesson-2-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"茶\" mean?","options":["to like","to not like","rice","tea"],"correctAnswer":"tea","displayHanzi":"茶"}'::jsonb, '茶 (chá) means "tea".', 8),
  ('lesson-2-2-ex-9', 'lesson-2-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"茶","pinyin":"chá","acceptedAnswers":["tea","tea"]}'::jsonb, '茶 = tea', 9),
  ('lesson-2-2-ex-10', 'lesson-2-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"茶","options":["chá","chī","xǐhuān","bù xǐhuān"],"correctAnswer":"chá"}'::jsonb, '茶 is pronounced chá.', 10),
  ('lesson-2-2-ex-11', 'lesson-2-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"chá","options":["米饭","喜欢","不喜欢","茶"],"correctAnswer":"茶"}'::jsonb, 'chá → 茶', 11),
  ('lesson-2-2-ex-12', 'lesson-2-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"米饭\" mean?","options":["rice","to eat","tea","to not like"],"correctAnswer":"rice","displayHanzi":"米饭"}'::jsonb, '米饭 (mǐfàn) means "rice".', 12),
  ('lesson-2-2-ex-13', 'lesson-2-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"米饭","pinyin":"mǐfàn","acceptedAnswers":["rice","rice"]}'::jsonb, '米饭 = rice', 13),
  ('lesson-2-3-ex-0', 'lesson-2-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"请\" mean?","options":["to drink","to eat","to want","please"],"correctAnswer":"please","displayHanzi":"请"}'::jsonb, '请 (qǐng) means "please".', 0),
  ('lesson-2-3-ex-1', 'lesson-2-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"请","pinyin":"qǐng","acceptedAnswers":["please","please"]}'::jsonb, '请 = please', 1),
  ('lesson-2-3-ex-2', 'lesson-2-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"请","options":["qǐng","yào","mǐfàn","chī"],"correctAnswer":"qǐng"}'::jsonb, '请 is pronounced qǐng.', 2),
  ('lesson-2-3-ex-3', 'lesson-2-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"qǐng","options":["吃","要","喝","请"],"correctAnswer":"请"}'::jsonb, 'qǐng → 请', 3),
  ('lesson-2-3-ex-4', 'lesson-2-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"要\" mean?","options":["to eat","to drink","please","to want"],"correctAnswer":"to want","displayHanzi":"要"}'::jsonb, '要 (yào) means "to want".', 4),
  ('lesson-2-3-ex-5', 'lesson-2-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"要","pinyin":"yào","acceptedAnswers":["to want","to want"]}'::jsonb, '要 = to want', 5),
  ('lesson-2-3-ex-6', 'lesson-2-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"要","options":["yào","qǐng","chī","mǐfàn"],"correctAnswer":"yào"}'::jsonb, '要 is pronounced yào.', 6),
  ('lesson-2-3-ex-7', 'lesson-2-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"yào","options":["喝","吃","请","要"],"correctAnswer":"要"}'::jsonb, 'yào → 要', 7),
  ('lesson-2-3-ex-8', 'lesson-2-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"吃\" mean?","options":["please","rice","to eat","to want"],"correctAnswer":"to eat","displayHanzi":"吃"}'::jsonb, '吃 (chī) means "to eat".', 8),
  ('lesson-2-3-ex-9', 'lesson-2-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"吃","pinyin":"chī","acceptedAnswers":["to eat","to eat"]}'::jsonb, '吃 = to eat', 9),
  ('lesson-2-3-ex-10', 'lesson-2-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"吃","options":["qǐng","chī","mǐfàn","hē"],"correctAnswer":"chī"}'::jsonb, '吃 is pronounced chī.', 10),
  ('lesson-2-3-ex-11', 'lesson-2-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"chī","options":["米饭","要","吃","请"],"correctAnswer":"吃"}'::jsonb, 'chī → 吃', 11),
  ('lesson-2-3-ex-12', 'lesson-2-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"喝\" mean?","options":["to eat","please","to want","to drink"],"correctAnswer":"to drink","displayHanzi":"喝"}'::jsonb, '喝 (hē) means "to drink".', 12),
  ('lesson-2-3-ex-13', 'lesson-2-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"喝","pinyin":"hē","acceptedAnswers":["to drink","to drink"]}'::jsonb, '喝 = to drink', 13),
  ('lesson-3-1-ex-0', 'lesson-3-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"妈妈\" mean?","options":["younger sister","dad","older brother","mom"],"correctAnswer":"mom","displayHanzi":"妈妈"}'::jsonb, '妈妈 (māma) means "mom".', 0),
  ('lesson-3-1-ex-1', 'lesson-3-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"妈妈","pinyin":"māma","acceptedAnswers":["mom","mom"]}'::jsonb, '妈妈 = mom', 1),
  ('lesson-3-1-ex-2', 'lesson-3-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"妈妈","options":["māma","de","gēge","bàba"],"correctAnswer":"māma"}'::jsonb, '妈妈 is pronounced māma.', 2),
  ('lesson-3-1-ex-3', 'lesson-3-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"māma","options":["哥哥","妹妹","爸爸","妈妈"],"correctAnswer":"妈妈"}'::jsonb, 'māma → 妈妈', 3),
  ('lesson-3-1-ex-4', 'lesson-3-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"爸爸\" mean?","options":["younger sister","dad","mom","possessive particle"],"correctAnswer":"dad","displayHanzi":"爸爸"}'::jsonb, '爸爸 (bàba) means "dad".', 4),
  ('lesson-3-1-ex-5', 'lesson-3-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"爸爸","pinyin":"bàba","acceptedAnswers":["dad","dad"]}'::jsonb, '爸爸 = dad', 5),
  ('lesson-3-1-ex-6', 'lesson-3-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"爸爸","options":["bàba","mèimei","de","gēge"],"correctAnswer":"bàba"}'::jsonb, '爸爸 is pronounced bàba.', 6),
  ('lesson-3-1-ex-7', 'lesson-3-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"bàba","options":["妈妈","爸爸","妹妹","的"],"correctAnswer":"爸爸"}'::jsonb, 'bàba → 爸爸', 7),
  ('lesson-3-1-ex-8', 'lesson-3-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"哥哥\" mean?","options":["mom","younger sister","dad","older brother"],"correctAnswer":"older brother","displayHanzi":"哥哥"}'::jsonb, '哥哥 (gēge) means "older brother".', 8),
  ('lesson-3-1-ex-9', 'lesson-3-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"哥哥","pinyin":"gēge","acceptedAnswers":["older brother","older brother"]}'::jsonb, '哥哥 = older brother', 9),
  ('lesson-3-1-ex-10', 'lesson-3-1', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"哥哥","options":["gēge","māma","bàba","de"],"correctAnswer":"gēge"}'::jsonb, '哥哥 is pronounced gēge.', 10),
  ('lesson-3-1-ex-11', 'lesson-3-1', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"gēge","options":["妹妹","爸爸","妈妈","哥哥"],"correctAnswer":"哥哥"}'::jsonb, 'gēge → 哥哥', 11),
  ('lesson-3-1-ex-12', 'lesson-3-1', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"妹妹\" mean?","options":["mom","older brother","dad","younger sister"],"correctAnswer":"younger sister","displayHanzi":"妹妹"}'::jsonb, '妹妹 (mèimei) means "younger sister".', 12),
  ('lesson-3-1-ex-13', 'lesson-3-1', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"妹妹","pinyin":"mèimei","acceptedAnswers":["younger sister","younger sister"]}'::jsonb, '妹妹 = younger sister', 13),
  ('lesson-3-2-ex-0', 'lesson-3-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"家\" mean?","options":["dad","I / me","family / home","mom"],"correctAnswer":"family / home","displayHanzi":"家"}'::jsonb, '家 (jiā) means "family / home".', 0),
  ('lesson-3-2-ex-1', 'lesson-3-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"家","pinyin":"jiā","acceptedAnswers":["family / home","family"]}'::jsonb, '家 = family / home', 1),
  ('lesson-3-2-ex-2', 'lesson-3-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"家","options":["bàba","māma","de","jiā"],"correctAnswer":"jiā"}'::jsonb, '家 is pronounced jiā.', 2),
  ('lesson-3-2-ex-3', 'lesson-3-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"jiā","options":["我","爸爸","家","妈妈"],"correctAnswer":"家"}'::jsonb, 'jiā → 家', 3),
  ('lesson-3-2-ex-4', 'lesson-3-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"的\" mean?","options":["dad","mom","family / home","possessive particle"],"correctAnswer":"possessive particle","displayHanzi":"的"}'::jsonb, '的 (de) means "possessive particle".', 4),
  ('lesson-3-2-ex-5', 'lesson-3-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"的","pinyin":"de","acceptedAnswers":["possessive particle","possessive particle"]}'::jsonb, '的 = possessive particle', 5),
  ('lesson-3-2-ex-6', 'lesson-3-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"的","options":["wǒ","māma","de","jiā"],"correctAnswer":"de"}'::jsonb, '的 is pronounced de.', 6),
  ('lesson-3-2-ex-7', 'lesson-3-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"de","options":["家","妈妈","爸爸","的"],"correctAnswer":"的"}'::jsonb, 'de → 的', 7),
  ('lesson-3-2-ex-8', 'lesson-3-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"妈妈\" mean?","options":["dad","I / me","mom","possessive particle"],"correctAnswer":"mom","displayHanzi":"妈妈"}'::jsonb, '妈妈 (māma) means "mom".', 8),
  ('lesson-3-2-ex-9', 'lesson-3-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"妈妈","pinyin":"māma","acceptedAnswers":["mom","mom"]}'::jsonb, '妈妈 = mom', 9),
  ('lesson-3-2-ex-10', 'lesson-3-2', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"妈妈","options":["bàba","jiā","de","māma"],"correctAnswer":"māma"}'::jsonb, '妈妈 is pronounced māma.', 10),
  ('lesson-3-2-ex-11', 'lesson-3-2', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"māma","options":["妈妈","爸爸","我","的"],"correctAnswer":"妈妈"}'::jsonb, 'māma → 妈妈', 11),
  ('lesson-3-2-ex-12', 'lesson-3-2', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"爸爸\" mean?","options":["family / home","possessive particle","dad","I / me"],"correctAnswer":"dad","displayHanzi":"爸爸"}'::jsonb, '爸爸 (bàba) means "dad".', 12),
  ('lesson-3-2-ex-13', 'lesson-3-2', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"爸爸","pinyin":"bàba","acceptedAnswers":["dad","dad"]}'::jsonb, '爸爸 = dad', 13),
  ('lesson-3-3-ex-0', 'lesson-3-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"很\" mean?","options":["very","good","family / home","small"],"correctAnswer":"very","displayHanzi":"很"}'::jsonb, '很 (hěn) means "very".', 0),
  ('lesson-3-3-ex-1', 'lesson-3-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"很","pinyin":"hěn","acceptedAnswers":["very","very"]}'::jsonb, '很 = very', 1),
  ('lesson-3-3-ex-2', 'lesson-3-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"很","options":["dà","hǎo","xiǎo","hěn"],"correctAnswer":"hěn"}'::jsonb, '很 is pronounced hěn.', 2),
  ('lesson-3-3-ex-3', 'lesson-3-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"hěn","options":["很","小","家","好"],"correctAnswer":"很"}'::jsonb, 'hěn → 很', 3),
  ('lesson-3-3-ex-4', 'lesson-3-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"大\" mean?","options":["big","family / home","small","good"],"correctAnswer":"big","displayHanzi":"大"}'::jsonb, '大 (dà) means "big".', 4),
  ('lesson-3-3-ex-5', 'lesson-3-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"大","pinyin":"dà","acceptedAnswers":["big","big"]}'::jsonb, '大 = big', 5),
  ('lesson-3-3-ex-6', 'lesson-3-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"大","options":["hěn","hǎo","xiǎo","dà"],"correctAnswer":"dà"}'::jsonb, '大 is pronounced dà.', 6),
  ('lesson-3-3-ex-7', 'lesson-3-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"dà","options":["好","家","大","小"],"correctAnswer":"大"}'::jsonb, 'dà → 大', 7),
  ('lesson-3-3-ex-8', 'lesson-3-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"小\" mean?","options":["small","very","big","family / home"],"correctAnswer":"small","displayHanzi":"小"}'::jsonb, '小 (xiǎo) means "small".', 8),
  ('lesson-3-3-ex-9', 'lesson-3-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"小","pinyin":"xiǎo","acceptedAnswers":["small","small"]}'::jsonb, '小 = small', 9),
  ('lesson-3-3-ex-10', 'lesson-3-3', 'pinyin_recognition', 'Select the correct pinyin', '{"hanzi":"小","options":["hǎo","xiǎo","hěn","jiā"],"correctAnswer":"xiǎo"}'::jsonb, '小 is pronounced xiǎo.', 10),
  ('lesson-3-3-ex-11', 'lesson-3-3', 'reverse_pinyin', 'Which hanzi matches this pinyin?', '{"pinyin":"xiǎo","options":["小","很","家","大"],"correctAnswer":"小"}'::jsonb, 'xiǎo → 小', 11),
  ('lesson-3-3-ex-12', 'lesson-3-3', 'multiple_choice', 'Select the correct translation', '{"question":"What does \"好\" mean?","options":["small","big","very","good"],"correctAnswer":"good","displayHanzi":"好"}'::jsonb, '好 (hǎo) means "good".', 12),
  ('lesson-3-3-ex-13', 'lesson-3-3', 'hanzi_to_english', 'Type the English meaning', '{"hanzi":"好","pinyin":"hǎo","acceptedAnswers":["good","good"]}'::jsonb, '好 = good', 13);

-- ========== ROW LEVEL SECURITY ==========
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
