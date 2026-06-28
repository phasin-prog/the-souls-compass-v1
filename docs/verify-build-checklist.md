# Verify Build Checklist — Phase 0–7 (stack ล่าสุด)

> โค้ดถูก commit โดย Orchestrator ผ่าน GitHub integration และ **ยังไม่เคยรัน build**
> Frontend/QA (หรือเจ้าของ) รันยืนยันครั้งแรก แล้วรายงานผลกลับ

## Stack
- **Next.js 15** (App Router) · **React 19**
- **Tailwind CSS v4** (CSS-first `@theme` ใน app/globals.css — ไม่มี tailwind.config.ts)
- **TypeScript 5** · **ESLint 9** (eslint-config-next 15)

## Prerequisite
- Node.js >= 20 (แนะนำ; Next 15 ต้องการ >= 18.18)
- ไม่มี auth/DB/env ให้ตั้งค่า

## คำสั่ง (ตามลำดับ)
```bash
git clone https://github.com/phasin-prog/the-souls-compass-v1.git
cd the-souls-compass-v1
npm install
npx tsc --noEmit
npm run build      # สำคัญสุด
npm run lint
npm run dev        # http://localhost:3000
```

## เกณฑ์ผ่าน
- build ผ่าน ไม่มี error
- เปิดได้: /, /articles, /concepts, /reading-sets, /sources, /manifesto, /support, /articles/psyche
- ไม่มี horizontal overflow บน mobile · nav + hamburger ทำงาน
- ไม่มี EN / language switcher

## จุดเสี่ยงเฉพาะของการอัปเกรด (ตรวจตรงนี้ก่อน)
| area | จุดเสี่ยง |
|------|----------|
| Tailwind v4 | ใช้ `@import "tailwindcss";` + `@theme` ใน app/globals.css; postcss ใช้ `@tailwindcss/postcss`; สี custom (`--color-*`) ต้องกลายเป็น utility เช่น bg-midnight, text-antique-gold |
| Next 15 params | dynamic route `app/articles/[slug]/page.tsx` ใช้ `params: Promise<{slug}>` + `await` แล้ว (generateMetadata + page เป็น async) |
| React 19 types | `@types/react` 19 — ตรวจ children typing ใน layout/components |
| ESLint 9 | `next lint` ครั้งแรกอาจถามตั้งค่า — เลือก Strict; .eslintrc.json ยังถูกอ่านผ่าน compat |
| path alias | `@/*` → `./*` ต้อง resolve (ทุก import) |
| arbitrary classes | `bg-[radial-gradient(...)]`, `bg-[#080B16]`, `text-[#1a1306]` — v4 รองรับ |

## ยังไม่ได้ทำ (ไม่ใช่ build error)
1. **เว็บฟอนต์ยังไม่ wire** — Noto Serif Thai / IBM Plex Sans Thai เป็น fallback; Frontend เพิ่มผ่าน `next/font/google` แล้ว verify ซ้ำ
2. หน้า index ส่วนใหญ่เป็น empty state (เนื้อหาจริง Phase 13)

## ถ้า build ไม่ผ่าน
ส่ง error เต็ม (ไฟล์ + บรรทัด + ข้อความ) กลับมา — Orchestrator มอบ Frontend Engineering แก้แล้ว commit fix
