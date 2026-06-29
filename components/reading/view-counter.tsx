"use client";

import { useEffect, useState } from "react";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { incrementPageView, getPageView } from "@/lib/content/views-db";

// ตัวนับผู้เยี่ยมชมต่อบทความ — เพิ่ม +1 ครั้งเดียวต่อ session ต่อ slug
// ใช้ anon client (ไม่ต้องล็อกอิน) · ถ้าตาราง/RPC ยังไม่พร้อม จะซ่อนตัวเองอย่างนุ่มนวล
export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClerkSupabaseClient(async () => null);
    let active = true;
    (async () => {
      const key = `archron:viewed:${slug}`;
      let v: number | null = null;
      try {
        if (!sessionStorage.getItem(key)) {
          v = await incrementPageView(supabase, slug);
          if (v !== null) sessionStorage.setItem(key, "1");
        }
      } catch {
        /* sessionStorage อาจถูกปิด — ข้ามไป */
      }
      if (v === null) v = await getPageView(supabase, slug);
      if (active) setViews(v);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant/60">
      <span className="material-symbols-outlined text-[16px] text-burnished-gold/70">visibility</span>
      ผู้เยี่ยมชม {views.toLocaleString("th-TH")} ครั้ง
    </span>
  );
}
