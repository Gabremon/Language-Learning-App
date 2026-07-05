/**
 * Regenerates supabase/migrations/20260710000000_starter_sentences.sql
 * Run: npx tsx scripts/generate-starter-migration.ts
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { STARTER_SENTENCES } from "../src/data/starter-hsk1/starter-sentences";
import { lessonSentenceMap } from "../src/data/seed";
import { getAllExercises } from "../src/data/seed";

function sqlStr(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlNullable(value: string | undefined | null): string {
  return value == null || value === "" ? "null" : sqlStr(value);
}

function sqlJson(value: unknown): string {
  return `${sqlStr(JSON.stringify(value))}::jsonb`;
}

const starterLessonIds = Object.keys(lessonSentenceMap).filter(
  (id) => id.startsWith("lesson-sa-") || id.startsWith("lesson-sb-")
);

const exercises = getAllExercises().filter((ex) =>
  starterLessonIds.includes(ex.lessonId)
);

const lines: string[] = [
  "-- Starter band: lesson-specific sentences + refreshed exercises",
  "",
  "insert into sentences (id, course_id, hanzi, pinyin, english, difficulty, grammar_notes) values",
  STARTER_SENTENCES.map(
    (s) =>
      `  (${sqlStr(s.id)}, ${sqlStr(s.courseId)}, ${sqlStr(s.hanzi)}, ${sqlStr(s.pinyin)}, ${sqlStr(s.english)}, ${s.difficulty}, ${sqlNullable(s.grammarNotes)})`
  ).join(",\n"),
  "on conflict (id) do update set",
  "  hanzi = excluded.hanzi,",
  "  pinyin = excluded.pinyin,",
  "  english = excluded.english,",
  "  difficulty = excluded.difficulty,",
  "  grammar_notes = excluded.grammar_notes;",
  "",
  `delete from lesson_sentences where lesson_id in (${starterLessonIds.map(sqlStr).join(", ")});`,
  "",
];

const lessonSentenceRows = starterLessonIds.flatMap((lessonId) =>
  (lessonSentenceMap[lessonId] ?? []).map(
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
  "delete from exercises where lesson_id like 'lesson-sa-%' or lesson_id like 'lesson-sb-%';",
  "",
  "insert into exercises (id, lesson_id, type, prompt, payload_json, explanation, order_index) values",
  exercises
    .map(
      (e) =>
        `  (${sqlStr(e.id)}, ${sqlStr(e.lessonId)}, ${sqlStr(e.type)}, ${sqlStr(e.prompt)}, ${sqlJson(e.payload)}, ${sqlNullable(e.explanation)}, ${e.orderIndex})`
    )
    .join(",\n") + ";"
);

const outPath = join(
  process.cwd(),
  "supabase/migrations/20260710000000_starter_sentences.sql"
);
writeFileSync(outPath, lines.join("\n"));
console.log(`Wrote ${outPath} (${exercises.length} exercises, ${STARTER_SENTENCES.length} sentences)`);
