"use server";

import { revalidatePath } from "next/cache";

// E7 — รีเฟรช cache ของหน้า public หลังเผยแพร่
// (การเขียน DB ทำฝั่ง client ผ่าน RLS แล้ว ส่วนนี้ทำแค่ revalidate ซึ่งต้องรันฝั่ง server)
// มีผลเต็มเมื่อ E8 สลับหน้า public ให้ดึงจาก Supabase
export async function revalidatePublic(slug: string) {
  revalidatePath("/articles");
  revalidatePath("/concepts");
  if (slug && slug.trim() !== "") {
    revalidatePath(`/articles/${slug}`);
    revalidatePath(`/concepts/${slug}`);
  }
}
