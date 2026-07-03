import "server-only";

import type { CourseCatalog } from "@/lib/course-utils";
import { getCourseCatalog } from "@/lib/data/course";

export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export async function loadCourseCatalog(): Promise<LoadResult<CourseCatalog>> {
  try {
    const data = await getCourseCatalog();
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load course data";
    console.error("[loadCourseCatalog]", message);
    return { ok: false, message };
  }
}
