import type { ContentEntry } from "@/types/content";
import {
  entries as staticEntries,
  getEntryBySlug as getStaticEntryBySlug,
} from "@/lib/content/entries";
import {
  getPublishedEntries,
  getPublishedEntryBySlug,
} from "@/lib/content/entries-db";
import { cached, KEYS } from "@/lib/cache/cache";

// E8 — แหล่งข้อมูลหน้า public
// อ่านจาก Supabase (เฉพาะ status=published) + Upstash cache (300s TTL)
// → fallback ไป seed static เพื่อให้เว็บไม่ล่มและ build ผ่านแม้ยังไม่ได้ตั้ง Supabase

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function staticPublished(): ContentEntry[] {
  return staticEntries.filter((e) => e.status === "published");
}

export async function getPublicEntries(): Promise<ContentEntry[]> {
  if (hasSupabaseEnv()) {
    try {
      const cachedEntries = await cached(KEYS.entries, async () => {
        const fromDb = await getPublishedEntries();
        return fromDb.length > 0 ? fromDb : null;
      });
      if (cachedEntries) return cachedEntries;
    } catch {
      // DB เข้าถึงไม่ได้ — ใช้ static แทน
    }
  }
  return staticPublished();
}

export async function getPublicEntryBySlug(
  slug: string,
): Promise<ContentEntry | null> {
  if (hasSupabaseEnv()) {
    try {
      return await cached(KEYS.entryBySlug(slug), async () => {
        return getPublishedEntryBySlug(slug);
      });
    } catch {
      // DB เข้าถึงไม่ได้ — fallback ไป static
    }
  }
  return getStaticEntryBySlug(slug) ?? null;
}
