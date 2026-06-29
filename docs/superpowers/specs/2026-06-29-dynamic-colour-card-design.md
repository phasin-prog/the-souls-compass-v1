# ARCHRON — Dynamic Colour System + Card Unification (Design Spec)

> วันที่: 2026-06-29
> ขอบเขต: full cosmology theming (ระดับ 3) + unify ทุก card ใช้ `.archron-card` + เพิ่ม cosmology variant
> แนวทาง: C — data-attribute ระดับหน้า + utility class ระดับการ์ด

---

## 1. เป้าหมาย

- ระบบสีชัดเจน สื่อสารความหมาย — cosmology หมวดนั้น ๆ ปรากฏที่ surface/border/accent
- Dynamic Colour: theme เปลี่ยนตาม **route** (global per-page) + ตาม **เนื้อหาในการ์ด** (card-level override)
- Unify ทุก card ใช้ `.archron-card` ภาษาเดียวกัน + ลบ `.concept-card` เก่า

---

## 2. สถาปัตยกรรม — 2 ชั้น, variable ชุดเดียวกัน

### 2.1 Route theme = `<html data-cosmology="...">` (สืบทอดทั้งหน้า)
`AccentController` ตั้ง `data-cosmology` บน `<html>` ตาม path (คง `--accent` เดิมไว้ด้วย) → CSS variable ชุดถูกตั้งที่ `:root[data-cosmology="..."]`

### 2.2 Card override = `archron-card archron-card--{cosmology}` (override เฉพาะใบ)
utility class แต่ละ cosmology ตั้ง variable ชุดเดียวกัน → override default ของหน้าได้

### 2.3 Variable ชุดใหม่ (cosmology-aware)
- `--cosmology-accent` — สี accent ประจำ cosmology (เดิม: `--accent`)
- `--cosmology-accent-soft` — accent โปร่งสำหรับ tint/border
- `--surface-tint` — tint ผิวการ์ด (color-mix accent เข้า paper)
- `--border-tint` — tint ขอบการ์ด
- `--glow-tint` — tint เรือง hover

> ทุก element ที่ต้องการ cosmology awareness อ่านจาก variable ชุดนี้ → route theme และ card override ใช้กลไกเดียวกัน

---

## 3. Color Cosmology map (single source of truth)

อ้างอิงจาก `lib/content/cosmology.ts` ที่มี + icon spec → รวมเป็น palette ชุดเดียว:

| Cosmology | accent (มืดพอ) | ใช้กับ route |
|---|---|---|
| prima | `#B9C2CE` | /constellation |
| psyche | `#6E93A8` | /concepts |
| lumen | `#E7D7A6` | /manifesto |
| sapientia | `#CBA45A` | /articles, /sources, /knowledge, default |
| mercurius | `#8AA395` | /schools, /guide, /external-links |

> ค่า accent คงค่าสว่างปรับสำหรับพื้นมืดตามที่มีอยู่ (cosmology.ts) — ไม่ใช่ค่าสดจาก icon spec เพราะ surface มืดต้องการ accent ที่สว่างพอ

---

## 4. `.archron-card` + cosmology variant

### 4.1 Base `.archron-card` (รับ theme ของหน้า)
- ใช้ `--surface-tint`/`--border-tint`/`--glow-tint` จาก `:root[data-cosmology]`
- gradient/border/hover/lift เหมือนเดิม แต่ tint อ้าง variable แทน hardcoded gold

### 4.2 Variant `archron-card--{cosmology}` (override)
- 6 class: `--prima`, `--psyche`, `--lumen`, `--sapientia`, `--mercurius`, `--humanitas`
- แต่ละ class ตั้ง `--cosmology-accent`/`--surface-tint`/`--border-tint`/`--glow-tint` ของตัวเอง
- การ์ดที่ระบุ variant จะใช้ cosmology ของตัวเอง ไม่ใช่ของหน้า

### 4.3 Variant ขนาด/บทบาท (ยังใช้ Tailwind utility อยู่)
- `archron-card--link` — link card แบบ not-found/recently-viewed (compact, hover subtle)
- คง padding/layout ให้ Tailwind จัดการ

---

## 5. Migration — Unify ทุก card

| ตำแหน่ง | เดิม | ใหม่ |
|---|---|---|
| `app/page.tsx:166` | `.concept-card` | `.archron-card` + variant ตาม ATLAS accent |
| `app/knowledge/page.tsx:106` | ad-hoc Tailwind | `.archron-card` |
| `app/support/page.tsx:26` | ad-hoc Tailwind | `.archron-card` |
| `app/not-found.tsx` (4×) | ad-hoc Tailwind | `.archron-card archron-card--link` |
| `components/recently-viewed.tsx:79` | ad-hoc Tailwind | `.archron-card archron-card--link` |
| `app/guide/page.tsx` (หลายจุด) | ad-hoc Tailwind | `.archron-card` สำหรับ panel card |
| `.concept-card` CSS | globals.css:441 | **ลบ** |
| Clerk card override (3 ไฟล์) | inline appearance | คง inline ไว้ (Clerk API) |

---

## 6. Implementation Plan — 3 Phase

### Phase 1 — Cosmology variable system (foundation)
- ขยาย `AccentController`: ตั้ง `data-cosmology` + คง `--accent`
- เพิ่ม `:root[data-cosmology="..."]` × 5 cosmology ใน globals.css (ตั้ง variable ชุด)
- เพิ่ม `archron-card--{cosmology}` × 6 variant
- Verify: build/lint เขียว, เปิดแต่ละหน้าดู aura/tint เปลี่ยน

### Phase 2 — Refactor `.archron-card` + ลบ `.concept-card`
- ปรับ `.archron-card` ให้รับ variable ชุดใหม่ (tint แทน hardcoded)
- ลบ `.concept-card` จาก globals.css
- แก้ `app/page.tsx:166` ใช้ `.archron-card` + variant
- Verify: build/lint เขียว, hero atlas card ยังสวย

### Phase 3 — Unify card ad-hoc → `.archron-card`
- not-found (4), recently-viewed, knowledge, support, guide → `.archron-card` (+`--link` ที่เหมาะ)
- Verify: build/lint เขียว, เปิดทุกหน้า card ภาษาเดียวกัน

---

## 7. Guardrails
- ❌ ไม่แตะ global chrome (header/footer/template body) — เฉพาะ `AccentController` + globals.css + card ในเนื้อหา
- ❌ ไม่ประดิษฐ์สีนอก cosmology 6 ตัว
- ❌ ไม่แตะ Clerk card (คง inline)
- ❌ ไม่ commit ถ้า build/lint ไม่เขียว
- ❌ ไม่ใช้ `any`
