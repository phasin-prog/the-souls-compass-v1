import type { SupabaseClient } from "@supabase/supabase-js";
import type { EditorDraft } from "@/lib/content/publish-validation";
import type { ContentEntry } from "@/types/content";
import { draftToRow, entryToDraft } from "@/lib/content/draft-mapper";
import { rowToEntry, type EntryRow } from "@/lib/content/entry-mapper";

// ชั้น persistence ของ editor (E3) — เรียกด้วย Supabase client ที่แนบ Clerk token (มาจาก E2)
// RLS บังคับ ownership: เขียน/อ่านได้เฉพาะของตน

// บันทึก/อัปเดตฉบับร่าง (upsert ตาม slug)
export async function saveDraft(
  sb: SupabaseClient,
  authorId: string,
  draft: EditorDraft,
) {
  const row = draftToRow(draft, authorId);
  const { data, error } = await sb
    .from("entries")
    .upsert(row, { onConflict: "slug" })
    .select()
    .maybeSingle();
  return { data, error };
}

// โหลดฉบับร่างของตนตาม slug → EditorDraft
export async function loadDraftBySlug(
  sb: SupabaseClient,
  slug: string,
): Promise<EditorDraft | null> {
  const { data, error } = await sb
    .from("entries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return entryToDraft(rowToEntry(data as EntryRow));
}

// รายการเนื้อหาของผู้ใช้ (สำหรับหน้า /studio รายการของฉัน)
export async function listMyDrafts(
  sb: SupabaseClient,
  authorId: string,
): Promise<ContentEntry[]> {
  const { data } = await sb
    .from("entries")
    .select("*")
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });
  return ((data ?? []) as EntryRow[]).map(rowToEntry);
}
