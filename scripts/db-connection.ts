import { existsSync, readFileSync } from "fs";
import { join } from "path";
import pg from "pg";

export const PROJECT_REF = "whfpbavfizsviaksevru";

export const POOLER_REGIONS_TO_TRY = [
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "us-east-2",
  "eu-west-1",
  "eu-central-1",
  "ap-southeast-1",
  "ap-northeast-1",
] as const;

export const POOLER_PREFIXES_TO_TRY = ["aws-1", "aws-0"] as const;

export function buildDirectUrl(password: string): string {
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${PROJECT_REF}.supabase.co:5432/postgres`;
}

export function buildPoolerSessionUrl(
  password: string,
  region: string,
  prefix: (typeof POOLER_PREFIXES_TO_TRY)[number] = "aws-1"
): string {
  return `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:5432/postgres`.replace(
    "aws-0-",
    `${prefix}-`
  );
}

/** Re-encode password in a postgres URL ($ and other chars break auth if left raw). */
export function normalizeConnectionUrl(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(
    /^postgres(?:ql)?:\/\/([^:@/]+)(?::([^@]*))?@([^/?#]+)(\/[^?#]*)?(\?[^#]*)?/
  );
  if (!match) return trimmed;

  const [, user, password = "", host, db = "/postgres", query = ""] = match;
  const decodedPass = decodeURIComponent(password);
  const encodedPass = encodeURIComponent(decodedPass);

  // Migrations need session pooler (5432), not transaction pooler (6543)
  const hostOnly = host.replace(":6543", ":5432");
  const queryClean = query.includes("pgbouncer") ? "" : query;

  return `postgresql://${user}:${encodedPass}@${hostOnly}${db}${queryClean}`;
}

export function loadEnvFile(): void {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();

    // Single-quoted — no expansion, keep $ literal
    if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    } else if (val.startsWith('"') && val.endsWith('"')) {
      // Double-quoted — still no shell expansion when we read the file,
      // but $ in passwords should use single quotes or %24 in the URL
      val = val.slice(1, -1);
    }

    process.env[key] = val;
  }
}

async function tryConnect(url: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 12000,
  });
  try {
    await client.connect();
    await client.end();
    return { ok: true };
  } catch (err: unknown) {
    await client.end().catch(() => {});
    const e = err as { message?: string };
    return { ok: false, reason: e.message ?? String(err) };
  }
}

function isAuthError(reason: string): boolean {
  return reason.includes("password authentication failed") || reason.includes("28P01");
}

function isTenantNotFound(reason: string): boolean {
  return reason.includes("tenant/user") && reason.includes("not found");
}

export async function resolveDatabaseUrl(): Promise<string> {
  // Session pooler (5432) — best for migrations on IPv4 networks
  const explicit =
    process.env.DIRECT_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    process.env.SUPABASE_DB_URL?.trim();

  if (explicit) {
    return normalizeConnectionUrl(explicit);
  }

  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!password) {
    throw new Error("NO_CREDENTIALS");
  }

  const explicitRegion = process.env.SUPABASE_DB_REGION?.trim();
  const prefixes =
    process.env.SUPABASE_DB_POOLER?.trim() === "aws-0"
      ? (["aws-0"] as const)
      : POOLER_PREFIXES_TO_TRY;

  const regions = explicitRegion ? [explicitRegion] : POOLER_REGIONS_TO_TRY;

  for (const prefix of prefixes) {
    for (const region of regions) {
      const url = buildPoolerSessionUrl(password, region, prefix);
      const result = await tryConnect(url);
      if (result.ok || isAuthError(result.reason)) return url;
      if (!isTenantNotFound(result.reason) && !result.reason.includes("ENOTFOUND")) {
        if (!result.reason.includes("ECONNREFUSED")) return url;
      }
    }
  }

  return buildDirectUrl(password);
}

export const CONNECTION_HELP = `
Project: ${PROJECT_REF}

Use the **Session pooler** URL (port 5432), not Transaction (6543).

If your password contains $ @ # ! etc., either:
  • URL-encode it ($ → %24), or
  • Use single quotes: SUPABASE_DB_PASSWORD='your$password'

Add to .env (from Supabase Connect → Session pooler):
  DIRECT_URL='postgresql://postgres.${PROJECT_REF}:PASSWORD@aws-1-us-east-1.pooler.supabase.com:5432/postgres'

Then: npm run db:test-connection
`;
