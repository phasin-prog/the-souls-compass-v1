# ARCHRON — Concept Icon System v1.0 (Design Spec)

> วันที่: 2026-06-29
> ขอบเขต: ระบบไอคอนแนวคิด 2 ชั้น (line icon + Color Cosmology background) ครอบคลุมทั้ง
> (1) favicon/app-icon/og-image นอกหน้าเว็บ และ (2) category icons ในหน้าเว็บ
> เป้าหมายหลัก: **มืออาชีพ + ไม่พังเป็น Type Error ทั้งหน้า** (เคยพังจาก icon metadata convention มาแล้ว)

---

## 1. ปรัชญาการออกแบบ

ไอคอนใน ARCHRON ไม่ใช่ของประดับ แต่เป็น **ตัวชี้แนวคิด (conceptual marker)** ประกอบด้วย 2 ชั้น:

1. **Line icon สีเดียว** — สื่อ "what" (สิ่งนี้คืออะไร)
2. **Color Cosmology background** — สื่อ "where" (อยู่ตรงไหนในเส้นทางการสืบค้น)

ผู้ใช้ควรจำหมวดได้จากสีก่อนอ่าน label — **color precedes text, shape precedes color**

### กฎดีไซน์ (บังคับ)
- Line weight 2px · มุมโค้ง · เรขาคณิต · minimal · optically balanced
- สร้างจาก circle / arc / line / point / intersection เท่านั้น
- ต้องจำได้ที่ 20×20px · ห้าม skeuomorphic / 3D / filled
- กรอบ: rounded square, corner radius **24%**, padding **20%**, flat color (no gradient/shadow)
- **ห้ามประดิษฐ์สี** — ทุกสีต้องตรง cosmological state ที่กำหนด

---

## 2. Architecture ภาพรวม

```
app/
├── icon.svg                 ← (มีอยู่) vesica logomark — แก้ corner radius ให้ตรง spec (24%)
├── apple-icon.png           ← static raster 180×180
├── favicon.ico              ← static 32×32 (multi-res 16/32/48)
├── opengraph-image.png      ← static 1200×630
├── twitter-image.png        ← static 1200×630 (ใช้ตัวเดียวกับ og)
├── manifest.ts              ← Web App Manifest (MetadataRoute.Manifest — type-safe)
└── layout.tsx               ← เพิ่ม metadata.icons/manifest/openGraph/twitter

components/icons/
├── cosmology.tsx            ← <CosmologyBg> + 6 cosmology palette
├── concept-icons.tsx        ← <ConceptIcon category> wrapper (type-safe)
└── glyphs/                  ← ไอคอนหมวดที่วาดเอง (1 ไฟล์ต่อ glyph)
    ├── psychology.tsx
    ├── philosophy.tsx
    ├── anthropology.tsx
    ├── ethics.tsx
    ├── alchemy.tsx
    ├── symbolism.tsx
    ├── concepts.tsx
    ├── knowledge-maps.tsx
    ├── library.tsx
    └── neuroscience.tsx

lib/content/
└── cosmology.ts             ← single source of truth: Cosmology type + COSMOLOGY map + cosmologyFor

docs/brand/                  ← source SVG ที่ใช้ export raster (trace ได้)
├── icon-source.svg
├── apple-icon-source.svg
├── favicon-source.svg
└── og-image-source.svg
```

### หลักการสำคัญ
- **ไม่ใช้ `ImageResponse` / `next/og` เลย** → ตัดต้นตอ Type Error ออกจากระบบ
- **type-safe ทุกจุด:** `Cosmology` / `CategoryId` เป็น union literal, category → cosmology map อยู่ไฟล์เดียว
- **Single source of truth:** สี cosmology ใน `lib/content/cosmology.ts` เป็นทางการ, globals.css และ SVG อ้างค่าเดียวกัน
- **ไม่แตะ global chrome** — แตะเฉพาะ `metadata` ใน layout ไม่ใช่ body/header/footer

---

## 3. Cosmology Map + Type System

### 3.1 Type definitions (`lib/content/cosmology.ts`)

```ts
export type Cosmology =
  | "prima-materia" | "psyche" | "lumen"
  | "mercurius" | "sapientia" | "humanitas";

export type CosmologyPalette = {
  id: Cosmology;
  label: string;        // ชื่อสำหรับ a11y/tooltip
  bg: string;           // พื้นหลัง (flat color)
  icon: string;         // สีเส้นไอคอน
  meaning: string;      // ความหมาย (tooltip)
  usedFor: string[];    // category ที่ใช้สีนี้
};

export type CategoryId =
  | "psychology" | "philosophy" | "anthropology" | "ethics"
  | "alchemy" | "symbolism" | "concepts" | "knowledge-maps"
  | "library" | "neuroscience";
```

### 3.2 Color map (ค่าจาก spec ตรงตัว — ไม่ประดิษฐ์)

| Cosmology | bg | icon | ความหมาย |
|---|---|---|---|
| Prima Materia | `#1B1C2E` | `#F5F1E8` | สิ่งที่ยังไม่รู้ · ปริศนา · เงา · กำเนิด |
| Psyche | `#476C82` | `#F5F1E8` | จิตใจ · อารมณ์ · การสำรวจภายใน |
| Lumen | `#E9D7A5` | `#2B2B2B` | ความเข้าใจ · ปัญญาตื่นรู้ · แนวคิดสำคัญ |
| Mercurius | `#6D7462` | `#F5F1E8` | การแปรเปลี่ยน · บูรณาการ · สังเคราะห์ข้ามศาสตร์ |
| Sapientia | `#B08D57` | `#1B1C2E` | ปัญญา · อารยธรรม · มรดก |
| Humanitas | `#EFE8DD` | `#2B2B2B` | มนุษยชาติ · วัฒนธรรม · สังคม |

### 3.3 Category → Cosmology mapping (เดียว, type-safe)

```ts
export function cosmologyFor(category: CategoryId): CosmologyPalette {
  // วนหาใน COSMOLOGY[*].usedFor — throw เด็ดขาดถ้าไม่เจอ (กัน category หลุด)
}
```

จุด type-safe: `CategoryId` union → พิมพ์ผิด = compile error ทันที (ไม่ใช่ runtime ทั้งหน้า)

### 3.4 การอัปเดต `globals.css`

อัปเดตเฉพาะ **6 core cosmology token** ให้ตรง spec:
- `--color-prima: #181B24` → `#1B1C2E`
- `--color-psyche: #3D6177` → `#476C82`
- `--color-lumen: #E7D7A6` → `#E9D7A5`
- `--color-mercurius: #607565` → `#6D7462`
- `--color-sapientia: #B58D4A` → `#B08D57`
- `--color-humanitas: #F3EEE5` → `#EFE8DD`

semantic alias (`--color-gold`, `--color-ivory` ฯลฯ) คงไว้ — เป็นดีไซน์แยกต่างหาก

---

## 4. React SVG Component System (Category Icons)

### 4.1 `<CosmologyBg>` — กรอบพื้นหลัง

```tsx
type Props = {
  cosmology: Cosmology;
  size?: number;            // default 24
  className?: string;
  children: React.ReactNode; // เส้นไอคอน (stroke = currentColor)
  title?: string;            // a11y
};
```

กฎจาก spec ที่ฝังใน component:
- Corner radius 24% = `rx=11.52` บน viewBox 48
- Padding 20% = glyph วาดในกรอบ 60% ตรงกลาง (scale 0.6 + translate กึ่งกลาง)
- glyph ใช้ `stroke="currentColor"` + `color={c.icon}` → สี icon ตั้งจาก cosmology เดียวกันเสมอ

### 4.2 Glyph components (วาดเอง, 1 ไฟล์ต่อ glyph)

แต่ละ glyph ใน `viewBox="0 0 24 24"`, stroke 2px, มุมโค้ง, เรขาคณิต, ใช้ circle/arc/line/point/intersection — เหมือน vesica logomark ที่มีอยู่

### 4.3 `<ConceptIcon>` — entry point เดียว (type-safe)

```tsx
const GLYPHS: Record<CategoryId, React.ComponentType> = {
  psychology: PsychologyGlyph,
  philosophy: PhilosophyGlyph,
  // ... 10 glyphs
};

export function ConceptIcon({ category, size, className, title }: {
  category: CategoryId; size?: number; className?: string; title?: string;
}) {
  const Glyph = GLYPHS[category];
  const palette = cosmologyFor(category);
  return (
    <CosmologyBg cosmology={palette.id} size={size} className={className} title={title}>
      <Glyph />
    </CosmologyBg>
  );
}
```

จุด type-safe:
- `Record<CategoryId, React.ComponentType>` → ลืมเพิ่ม glyph สำหรับ category ใหม่ = **compile error**
- `category` prop เป็น `CategoryId` union → พิมพ์ผิด compile error
- ไม่มี `any`, ไม่มี runtime lookup ที่อาจ undefined

---

## 5. Favicon / App-Icon / OG-Image (Static Convention)

### 5.1 เหตุผล: ทำไม static ปลอดภัยกว่า generated

| ประเภท | Type risk |
|---|---|
| **Static file** (`icon.svg`, `apple-icon.png`, `favicon.ico`, `opengraph-image.png`) | **0** — binary asset, Next จัดการ metadata อัตโนมัติ ไม่มี type signature ให้ผิด |
| **Generated** (`icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`) | **สูง** — ต้อง export `ImageResponse`/`size`/`contentType`/`alt` ตาม signature เข้มงวด; เขียนผิดนิดเดียว = build/runtime พังทั้งหน้า |

→ เลือก static ทั้งหมด

### 5.2 ไฟล์ static ที่จะมี

- `app/icon.svg` — (มีอยู่) แก้ corner radius 24%
- `app/apple-icon.png` — 180×180
- `app/favicon.ico` — 32×32 (multi-res 16/32/48)
- `app/opengraph-image.png` — 1200×630
- `app/twitter-image.png` — 1200×630 (ใช้ตัวเดียวกับ og)

source SVG เก็บใน `docs/brand/` เพื่อ trace การ export

### 5.3 `app/manifest.ts`

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ARCHRON — คลังความรู้เพื่อเข้าใจจิตวิญญาณของมนุษย์",
    short_name: "ARCHRON",
    description: "คลังความรู้เพื่อเข้าใจจิตวิญญาณของมนุษย์ ข้ามผ่านห้วงเวลาและศาสตร์วิชา",
    start_url: "/",
    display: "standalone",
    background_color: "#1B1C2E",
    theme_color: "#1B1C2E",
    icons: [
      { src: "/icon.svg",       type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png",     sizes: "180x180" },
      { src: "/favicon.ico",    type: "image/x-icon",  sizes: "16x16 32x32 48x48" },
    ],
  };
}
```

### 5.4 `layout.tsx` metadata (เติมฟิลด์ที่ขาด)

```ts
export const metadata: Metadata = {
  title: "...",
  description: "...",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-image.png"],
  },
};
```

### 5.5 OG-image content

ใช้ title/description ที่มีใน metadata เดิม (`ARCHRON — คลังความรู้เพื่อเข้าใจจิตวิญญาณของมนุษย์`) — **ไม่เพิ่มข้อความ/แบรนด์ใหม่** (guardrail ข้อ 3)

---

## 6. Implementation Plan — 3 Phase

> จำกัด 3 Phase ตามคำขอ แต่ละ Phase build/lint เขียวก่อนไป Phase ถัดไป

### Phase 1 — Foundation: Cosmology system + React SVG components
**ไฟล์:**
- อัปเดต 6 cosmology token ใน `app/globals.css`
- สร้าง `lib/content/cosmology.ts` (`Cosmology`, `COSMOLOGY`, `CategoryId`, `cosmologyFor`)
- สร้าง `components/icons/cosmology.tsx` (`<CosmologyBg>`)
- สร้าง `components/icons/glyphs/*.tsx` (10 glyphs)
- สร้าง `components/icons/concept-icons.tsx` (`<ConceptIcon>`)

**ผลลัพธ์:** ระบบ cosmology + category icon component พร้อมใช้ (type-safe, pure component — ยังไม่ใช้ที่ไหน)

**Verify:** `npm run lint` + `npm run build` เขียว

### Phase 2 — Brand icons: favicon/app-icon/og-image (static convention)
**ไฟล์:**
- แก้ `app/icon.svg` (corner radius 24%)
- สร้าง `docs/brand/*.svg` (source) + export raster ลง `app/`
  - `apple-icon.png` (180×180)
  - `favicon.ico` (multi-res 16/32/48)
  - `opengraph-image.png` + `twitter-image.png` (1200×630)
- สร้าง `app/manifest.ts`
- เติม `metadata.icons/manifest/openGraph/twitter` ใน `app/layout.tsx`

**ผลลัพธ์:** favicon ขึ้น browser tab, app-icon สำหรับ home screen, og-image สำหรับ share preview

**Verify:** build/lint เขียว + เปิด dev ดู tab icon + `GET /manifest.webmanifest` + เปิด `/opengraph-image.png`

### Phase 3 — Migration: Material Symbols → ConceptIcon (ขอบเขตจำกัด)
**ไฟล์:**
- `lib/content/external-links.ts`: `icon: string` → `icon: CategoryId`
- `components/external-links/external-links-browser.tsx`: แทน Material Symbols span ด้วย `<ConceptIcon category={...}>`

**ขอบเขต:** เฉพาะหน้า `/external-links` (6 หมวด) เป็นตัวอย่าง — **ไม่ขยายไป articles/concepts/constellation** โดยไม่ได้สั่ง (guardrail ข้อ 1, 6)

**ผลลัพธ์:** หน้า `/external-links` แสดง category icons 2 ชั้น (line + cosmology bg)

**Verify:** build/lint เขียว + เปิด `/external-links` ดู 6 หมวดมีไอคอนถูกต้อง

---

## 7. Type Error Guard — สรุปความปลอดภัย

ที่ผ่านมาเคยพังจาก icon metadata convention → กันไว้ 3 ชั้น:

1. **ไม่ใช้ generated convention เลย** → ตัด `ImageResponse` (ต้นเหตุหลัก) ออกจากระบบทั้งหมด
2. **type เข้มงวด:** `Cosmology`/`CategoryId` union literal + `Record<CategoryId, ...>` → พิมพ์ผิด = compile error ไม่ใช่ runtime ทั้งหน้า
3. **Pure React SVG component** สำหรับ category icons → ไม่มี metadata convention มาเกี่ยว, type-safe โดยธรรมชาติ

### ตารางความปลอดภัย

| ไฟล์ | วิธี | Type Error risk |
|---|---|---|
| `icon.svg` | static | 0 |
| `apple-icon.png` | static | 0 |
| `favicon.ico` | static | 0 |
| `opengraph-image.png` | static | 0 |
| `twitter-image.png` | static | 0 |
| `manifest.ts` | `MetadataRoute.Manifest` (type-safe) | ตรวจจับตอน compile |
| `layout.tsx` metadata | `Metadata` type | ตรวจจับตอน compile |
| `cosmology.ts` | union literal + Record | ตรวจจับตอน compile |
| `<ConceptIcon>` | `CategoryId` prop | ตรวจจับตอน compile |

→ **ไม่มีจุดไหนที่ type ผิดจะทำให้ทั้งหน้าพัง**

---

## 8. Verification Checklist

| ตรวจอะไร | วิธี | เกณฑ์ผ่าน |
|---|---|---|
| Type safety | `npm run build` | เขียว ไม่มี TS error |
| Lint | `npm run lint` | เขียว |
| No runtime crash | `npm run dev` → เปิดทุกหน้า | ไม่มี console error, ไม่ขึ้น error page |
| Favicon ขึ้น tab | เปิด dev → ดู browser tab | ไอคอน vesica ขึ้น |
| Manifest | `GET /manifest.webmanifest` | คืน JSON ถูกต้อง |
| OG preview | เปิด `/opengraph-image.png` | รูปขึ้น 1200×630 |
| Category icons | เปิด `/external-links` | 6 หมวดมีไอคอน 2 ชั้น (line + cosmology bg) |
| ไม่กระทบ chrome | `git diff` | ไม่แตะ `site-header`/`site-footer`/`template` |
| ไม่ใช้ `any` | `npm run lint` + grep | เขียว |

---

## 9. Guardrails — สิ่งที่จะไม่ทำ

- ❌ ไม่แตะ global chrome (`site-header`, `site-footer`, `layout.tsx` body, `template.tsx`)
- ❌ ไม่แต้มสีนอก 6 cosmology ที่กำหนด (guardrail ข้อ 5: ไม่ประดิษฐ์สี)
- ❌ ไม่ขยาย migration ไปหน้าอื่นนอกจาก `/external-links` โดยไม่ได้สั่ง
- ❌ ไม่เพิ่มข้อความ/แบรนด์ใหม่ใน og-image — ใช้ metadata ที่มีอยู่
- ❌ ไม่แก้ schema/RLS/migration
- ❌ ไม่ใช้ secret/API key ในโค้ด
- ❌ ไม่ commit ถ้า build/lint ไม่เขียว
