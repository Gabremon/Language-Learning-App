/**
 * Splits large HSK migration files into SQL-Editor-sized chunks (~200 KB each).
 * Run: npm run db:split-hsk
 *
 * Then paste each file from supabase/migrations/chunks/ into the SQL Editor, in order.
 */
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const MIGRATIONS = [
  "20260703000000_hsk2.sql",
  "20260704000000_hsk3.sql",
  "20260705000000_hsk4.sql",
  "20260706000000_hsk5.sql",
  "20260707000000_hsk6.sql",
];

const MAX_CHUNK_BYTES = 200_000;
const migrationsDir = join(process.cwd(), "supabase/migrations");
const chunksDir = join(migrationsDir, "chunks");

function splitMigrationStatements(sql: string): string[] {
  const statements: string[] = [];
  let current: string[] = [];

  for (const line of sql.split("\n")) {
    if (/^insert into /i.test(line) && current.length > 0) {
      statements.push(current.join("\n"));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) statements.push(current.join("\n"));

  return statements
    .map((s) => s.trim())
    .filter((s) => /^insert into /i.test(s));
}

function chunkInsert(sql: string, maxRows: number): string[] {
  const headerMatch = sql.match(/^(insert into\s+\S+\s*\([^)]+\)\s+values)\s*/is);
  if (!headerMatch) return [sql.endsWith(";") ? sql : `${sql};`];

  const header = headerMatch[1];
  let body = sql.slice(headerMatch[0].length).trimEnd();
  if (body.endsWith(";")) body = body.slice(0, -1).trimEnd();

  const parts = body.split(/\),\s*\n\s*\(/);
  if (parts.length <= maxRows) {
    return [sql.endsWith(";") ? sql : `${sql};`];
  }

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

function prepareStatements(sql: string): string[] {
  const out: string[] = [];
  for (const stmt of splitMigrationStatements(sql)) {
    if (stmt.length > 300_000) {
      out.push(...chunkInsert(stmt, 100));
    } else {
      out.push(stmt.endsWith(";") ? stmt : `${stmt};`);
    }
  }
  return out;
}

mkdirSync(chunksDir, { recursive: true });

let totalChunks = 0;
const manifest: string[] = [
  "# HSK migration chunks — run in SQL Editor in this order",
  "# Supabase Dashboard → SQL Editor → New query → paste → Run",
  "",
];

for (const file of MIGRATIONS) {
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  const statements = prepareStatements(sql);
  const fileChunks: string[] = [];
  let chunkIndex = 0;
  let currentChunk = `-- ${file}\n`;

  for (const stmt of statements) {
    const next = currentChunk + (currentChunk.endsWith("\n") ? "" : "\n") + stmt + "\n";
    if (next.length > MAX_CHUNK_BYTES && currentChunk.length > 50) {
      const name = `${file.replace(".sql", "")}_part${String(chunkIndex).padStart(2, "0")}.sql`;
      const path = join(chunksDir, name);
      writeFileSync(path, currentChunk, "utf8");
      fileChunks.push(name);
      chunkIndex++;
      currentChunk = `-- ${file} (continued)\n${stmt}\n`;
    } else {
      currentChunk = next;
    }
  }

  if (currentChunk.trim()) {
    const name = `${file.replace(".sql", "")}_part${String(chunkIndex).padStart(2, "0")}.sql`;
    writeFileSync(join(chunksDir, name), currentChunk, "utf8");
    fileChunks.push(name);
  }

  manifest.push(`## ${file}`);
  fileChunks.forEach((name, i) => {
    manifest.push(`${i + 1}. chunks/${name}`);
  });
  manifest.push("");
  totalChunks += fileChunks.length;
}

writeFileSync(join(chunksDir, "README.md"), manifest.join("\n"), "utf8");

console.log(`Wrote ${totalChunks} chunk files to supabase/migrations/chunks/`);
console.log("See supabase/migrations/chunks/README.md for run order.");
