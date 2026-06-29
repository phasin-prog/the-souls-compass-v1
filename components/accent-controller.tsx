"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { routeCosmology, routeAccent } from "@/lib/content/cosmology";

// ตั้งค่า cosmology บน <html> ตามเส้นทางปัจจุบัน:
//  - data-cosmology → ขับ variable ชุด (surface/border/glow tint) ทั้งหน้า
//  - --accent → คงไว้สำหรับ utility ที่อ้างอิง accent ตรง ๆ (เข้ากันได้กับโค้ดเดิม)
// ทั้งเว็บไล่สีนุ่ม ๆ เมื่อเปลี่ยนหน้า
export function AccentController() {
  const pathname = usePathname();
  useEffect(() => {
    const cosmology = routeCosmology(pathname ?? "/");
    document.documentElement.setAttribute("data-cosmology", cosmology);
    document.documentElement.style.setProperty("--accent", routeAccent(pathname ?? "/"));
  }, [pathname]);
  return null;
}
