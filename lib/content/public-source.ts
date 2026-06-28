import type { ContentEntry } from "@/types/content";
import {
  entries as staticEntries,
  getEntryBySlug as getStaticEntryBySlug,
} from "@/lib/content/entries";
import {
  getPublishedEntries,
  getPublishedEntryBySlug,
} from "@/lib/content/entries-db";

// E8 — แหล่งข้อมูลหน้า public
// อ่านจาก Supabase (เฉพาะ status=published) ก่อน ถ้า DB ว่าง / ยังไม่ตั้งค่า env / เข้าถึงไม่ได้
// → fallback ไป seed static เพื่อให้เว็บไม่ล่มและ build ผ่านแม้ยังไม่ได้ตั้ง Supabase
// ทำงานคู่กับ ISR (revalidate) + revalidatePath จาก E7 เพื่ออัปเดตเมื่อมีการเผยแพร่

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
      const fromDb = await getPublishedEntries();
      if (fromDb.length > 0) return fromDb;
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
      const fromDb = await getPublishedEntryBySlug(slug);
      if (fromDb) return fromDb;
    } catch {
      // DB เข้าถึงไม่ได้ — fallback ไป static ด้านล่าง
    }
  }
  return getStaticEntryBySlug(slug) ?? null;
}
