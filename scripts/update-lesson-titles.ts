/**
 * Sync lesson titles in Supabase from the local course catalog (English titles).
 * Run: npm run db:fix-lesson-titles
 */
import pg from "pg";
import { lessons } from "../src/data/course-content";
import { CONNECTION_HELP, loadEnvFile, resolveDatabaseUrl } from "./db-connection";

async function main() {
  loadEnvFile();

  let databaseUrl: string;
  try {
    databaseUrl = await resolveDatabaseUrl();
  } catch {
    console.error(CONNECTION_HELP);
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  let updated = 0;
  for (const lesson of lessons) {
    const result = await client.query(
      `UPDATE lessons SET title = $1 WHERE id = $2 AND title IS DISTINCT FROM $1`,
      [lesson.title, lesson.id]
    );
    updated += result.rowCount ?? 0;
  }

  console.log(`Updated ${updated} lesson title(s) (${lessons.length} in catalog).`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
