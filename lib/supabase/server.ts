import { createClient } from "@supabase/supabase-js";

// Server-side client (anon key) — ใช้สำหรับอ่านเนื้อหา published (RLS อนุญาตอ่าน published ทุกคน)
// TODO(E0): ตั้ง NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY ใน env
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { auth: { persistSession: false } },
  );
}
