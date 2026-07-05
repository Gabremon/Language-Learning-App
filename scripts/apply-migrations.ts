/**
 * Apply Supabase SQL migrations via direct Postgres connection.
 * Run: npm run db:apply-hsk
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import pg from "pg";
import { CONNECTION_HELP, loadEnvFile, resolveDatabaseUrl } from "./db-connection";

const HSK_MIGRATIONS = [
  "20260703000000_hsk2.sql",
  "20260704000000_hsk3.sql",
  "20260705000000_hsk4.sql",
  "20260706000000_hsk5.sql",
  "20260707000000_hsk6.sql",
];

function splitMigrationStatements(sql: string): string[] {
  const statements: string[] = [];
  let current: string[] = [];

  for (const line of sql.split("\n")) {
    const isNewStatement =
      /^(insert into |delete from |update )/i.test(line) && current.length > 0;
    if (isNewStatement) {
      statements.push(current.join("\n"));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) statements.push(current.join("\n"));

  return statements
    .map((s) => s.trim())
    .filter((s) => /^(insert into |delete from |update )/i.test(s));
}

function chunkInsert(sql: string, maxRows: number): string[] {
  const headerMatch = sql.match(/^(insert into\s+\S+\s*\([^)]+\)\s+values)\s*/i);
  if (!headerMatch) return [sql.endsWith(";") ? sql : `${sql};`];

  const header = headerMatch[1];
  let body = sql.slice(headerMatch[0].length).trimEnd();
  if (body.endsWith(";")) body = body.slice(0, -1).trimEnd();

  const parts = body.split(/\),\s*\n\s*\(/);
  if (parts.length <= maxRows) return [sql.endsWith(";") ? sql : `${sql};`];

  const rows = parts.map((part, i) => {
    if (parts.length === 1) return part;
    if (i === 0) return `${part})`;
    if (i === parts.length - 1) return `(${part}`;
    return `(${part})`;
  });

  const chunks: string[] = [];
  for (let i = 0; i < rows.length; i += maxRows) {
    chunks.push(`${header}\n  ${rows.slice(i, i + maxRows).join(",\n  ")};`);
  }
  return chunks;
}

function prepareStatements(sql: string, maxRowsPerInsert: number): string[] {
  const out: string[] = [];
  for (const stmt of splitMigrationStatements(sql)) {
    if (/^insert into /i.test(stmt) && stmt.length > 400_000) {
      out.push(...chunkInsert(stmt, maxRowsPerInsert));
    } else {
      out.push(stmt.endsWith(";") ? stmt : `${stmt};`);
    }
  }
  return out;
}

async function clearHskLevel(client: pg.Client, hskLevel: number): Promise<void> {
  const unitPrefix = `unit-h${hskLevel}-`;
  const vocabPrefix = `v-h${hskLevel}-`;
  const sentencePrefix = `s-h${hskLevel}-`;

  console.log(`   Clearing prior HSK ${hskLevel} content...`);
  await client.query(
    `update user_progress
     set current_lesson_id = 'lesson-sa-1'
     where current_lesson_id in (
       select id from lessons where unit_id like $1
     )`,
    [`${unitPrefix}%`]
  );
  await client.query(
    `delete from exercise_attempts
     where exercise_id in (
       select id from exercises where lesson_id in (
         select id from lessons where unit_id like $1
       )
     )`,
    [`${unitPrefix}%`]
  );
  await client.query(
    `delete from lesson_attempts
     where lesson_id in (select id from lessons where unit_id like $1)`,
    [`${unitPrefix}%`]
  );
  await client.query(`delete from vocab_memory where vocab_item_id like $1`, [`${vocabPrefix}%`]);
  await client.query(
    `delete from exercises
     where lesson_id in (select id from lessons where unit_id like $1)`,
    [`${unitPrefix}%`]
  );
  await client.query(
    `delete from lesson_vocab
     where lesson_id in (select id from lessons where unit_id like $1)`,
    [`${unitPrefix}%`]
  );
  await client.query(
    `delete from lesson_sentences
     where lesson_id in (select id from lessons where unit_id like $1)`,
    [`${unitPrefix}%`]
  );
  await client.query(`delete from lessons where unit_id like $1`, [`${unitPrefix}%`]);
  await client.query(`delete from units where id like $1`, [`${unitPrefix}%`]);
  await client.query(`delete from sentences where id like $1`, [`${sentencePrefix}%`]);
  await client.query(`delete from vocab_items where id like $1`, [`${vocabPrefix}%`]);
}

async function applyFile(client: pg.Client, filePath: string): Promise<void> {
  const levelMatch = filePath.match(/hsk(\d)\.sql$/i);
  if (levelMatch) {
    await clearHskLevel(client, Number(levelMatch[1]));
  }

  const sql = readFileSync(filePath, "utf8");
  const statements = prepareStatements(sql, 200);
  const name = filePath.split("/").pop();

  console.log(`\n📄 ${name} — ${statements.length} statement(s)`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const kb = (stmt.length / 1024).toFixed(0);
    process.stdout.write(`   [${i + 1}/${statements.length}] ${kb} KB...`);
    const start = Date.now();
    await client.query(stmt);
    console.log(` done (${Date.now() - start}ms)`);
  }
}

async function main(): Promise<void> {
  loadEnvFile();

  let databaseUrl: string;
  try {
    databaseUrl = await resolveDatabaseUrl();
  } catch {
    console.error(CONNECTION_HELP);
    process.exit(1);
  }

  const args = process.argv.slice(2).filter((a) => a !== "--");
  const migrationsDir = join(process.cwd(), "supabase/migrations");

  function resolveMigrationPath(arg: string): string {
    if (arg.startsWith("/")) return arg;
    if (arg.includes("/")) return join(process.cwd(), arg);
    const withDir = join(migrationsDir, arg);
    if (existsSync(withDir)) return withDir;
    const withSql = join(migrationsDir, `${arg}.sql`);
    if (existsSync(withSql)) return withSql;
    return join(process.cwd(), arg);
  }

  const files =
    args.length > 0
      ? args.map(resolveMigrationPath)
      : HSK_MIGRATIONS.map((f) => join(migrationsDir, f));

  for (const file of files) {
    if (!existsSync(file)) {
      console.error(`❌ File not found: ${file}`);
      process.exit(1);
    }
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  const host = databaseUrl.includes("@") ? databaseUrl.split("@")[1]?.split("/")[0] : "postgres";
  console.log(`🔌 Connecting via ${host}...`);
  await client.connect();
  console.log("✅ Connected\n");

  try {
    for (const file of files) {
      await applyFile(client, file);
    }
    console.log("\n✅ All migrations applied successfully.");

    const units = await client.query("select count(*)::int as n from units");
    const lessons = await client.query("select count(*)::int as n from lessons");
    console.log(`   Units: ${units.rows[0].n}  Lessons: ${lessons.rows[0].n}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("\n❌ Migration failed:", err.message ?? err);
  if (String(err.message ?? err).includes("ECONNREFUSED")) {
    console.error(CONNECTION_HELP);
  }
  process.exit(1);
});
