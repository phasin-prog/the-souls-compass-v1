# Verify Build Checklist — Phase 0–7

> โค้ด Phase 0–7 ถูก commit โดย Orchestrator ผ่าน GitHub integration และ **ยังไม่เคยรัน build**
> เอกสารนี้ให้ Frontend/QA (หรือเจ้าของ) รันยืนยันครั้งแรก แล้วรายงานผลกลับ

## Prerequisite
- Node.js >= 18.17 (Next.js 14.2 ต้องการ)
- (ไม่มี auth/DB/env — ยังไม่ต้องตั้งค่าใด ๆ)

## คำสั่ง (รันตามลำดับ)
```bash
git clone https://github.com/phasin-prog/the-souls-compass-v1.git
cd the-souls-compass-v1
npm install
npx tsc --noEmit      # ตรวจ type
npm run build         # ตรวจ build จริง (สำคัญสุด)
npm run lint          # ตรวจ lint (ถ้าถามตั้งค่าครั้งแรก เลือก Strict)
npm run dev           # เปิดดูจริงที่ http://localhost:3000
```

## เกณฑ์ผ่าน (Acceptance — Phase 0)
- `npm run build` ผ่านโดยไม่มี error
- ไม่มี TypeScript / import error
- เปิดหน้าได้: `/`, `/articles`, `/concepts`, `/reading-sets`, `/sources`, `/manifesto`, `/support`, `/articles/psyche`
- ไม่มี horizontal overflow บน mobile · nav + hamburger ทำงาน
- ไม่มี EN / language switcher

## จุดเสี่ยงรายไฟล์ (ตรวจตรงนี้ถ้า build แดง)
| ไฟล์ / area | จุดเสี่ยง |
|-------------|----------|
| package.json | เวอร์ชัน deps resolve (next 14.2.5 / react 18.3.1 / tailwind 3.4.7) — รัน npm install ก่อน |
| tsconfig.json | path alias `@/*` → `./*` ต้องทำงาน (ใช้กับทุก import @/components, @/lib, @/types) |
| tailwind.config.ts | tokens อยู่ใต้ `extend` (merge กับ default) — สี custom ที่หน้าใช้ต้องมีครบ |
| app/globals.css | `@tailwind` directives + `@layer base` |
| app/layout.tsx | import `@/components/site-header`, `@/components/site-footer` ต้อง resolve |
| app/page.tsx | arbitrary class `bg-[radial-gradient(...)]`, `text-[#1a1306]` — valid; custom color ต้องมีใน config |
| components/site-header.tsx | `"use client"` + useState; unicode \u2715/\u2630 |
| app/articles/[slug]/page.tsx | `params: { slug: string }` (sync — ถูกต้องสำหรับ Next 14.2; ถ้าอัป Next 15 ต้องเปลี่ยนเป็น Promise), `generateStaticParams`, `notFound` |
| components/reading/reading-page.tsx | `Record<RelationType,string>`, non-null `current.mainThinkers!` (มี guard), optional fields — strict mode |
| lib/content/*.ts | literal union types (status/sourceType/relationType) ต้องตรงกับ types/content.ts |

## หมายเหตุที่ทราบอยู่แล้ว (ไม่ใช่ build error แต่ควรทำ)
1. **เว็บฟอนต์ยังไม่ wire** — Noto Serif Thai / IBM Plex Sans Thai ใช้แค่ fallback stack ใน globals.css/tailwind → Frontend ควรโหลดผ่าน `next/font/google` (ผูก `--font-serif` / `--font-sans`) แล้ว verify build อีกครั้ง
2. `reading-page.tsx` มี `href={\`/concepts\`}` — อาจโดน lint เตือน unnecessary template literal (ไม่ใช่ error)
3. หน้า index ส่วนใหญ่เป็น empty state — เนื้อหาจริงมาใน Phase 13

## ถ้า build ไม่ผ่าน
ส่ง error เต็ม (ชื่อไฟล์ + บรรทัด + ข้อความ) กลับมา — Orchestrator จะมอบ Frontend Engineering แก้ตาม scope แล้ว commit fix
