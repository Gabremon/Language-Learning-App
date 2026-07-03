/**
 * Test Postgres connection to Supabase.
 * Run: npm run db:test-connection
 */
import pg from "pg";
import {
  CONNECTION_HELP,
  PROJECT_REF,
  loadEnvFile,
  resolveDatabaseUrl,
} from "./db-connection";

async function main(): Promise<void> {
  loadEnvFile();

  let databaseUrl: string;
  try {
    databaseUrl = await resolveDatabaseUrl();
  } catch {
    console.log(CONNECTION_HELP);
    process.exit(1);
  }

  const host = databaseUrl.includes("@") ? databaseUrl.split("@")[1]?.split("/")[0] : "unknown";
  const user = databaseUrl.match(/^postgres(?:ql)?:\/\/([^:@/]+)/)?.[1] ?? "?";
  console.log(`Connecting as ${user} via ${host} ...`);

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    const units = await client.query("select count(*)::int as n from units");
    const lessons = await client.query("select count(*)::int as n from lessons");
    console.log("\n✅ Connected successfully!");
    console.log(`   Units:   ${units.rows[0].n}`);
    console.log(`   Lessons: ${lessons.rows[0].n}`);
    console.log("\nNext: npm run db:apply-hsk");
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    console.error("\n❌ Connection failed\n");
    console.error(e.message ?? err);

    if (e.message?.includes("password authentication failed") || e.code === "28P01") {
      console.error("\nWrong password OR special characters in the URL broke parsing.");
      console.error("If your password contains $, use %24 in the URL or single quotes:");
      console.error("  SUPABASE_DB_PASSWORD='your$password'");
      console.error("Or reset password here:");
      console.error(`https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database`);
    } else if (e.message?.includes("ECONNREFUSED") || e.message?.includes("tenant/user")) {
      console.error(CONNECTION_HELP);
    }
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

main();
