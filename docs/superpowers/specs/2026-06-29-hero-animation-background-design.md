# ARCHRON — Hero Animation + Cosmology Background (Design Spec)

> วันที่: 2026-06-29
> ขอบเขต: Hero animation (vesica unity) + Background pattern สำหรับ section สาย (แนวคิด/สำนัก)
> แนวทาง: SVG + GSAP (user override จาก pure CSS)
> Stack: gsap@3.15.0

---

## 1. เป้าหมาย

- **Hero animation**: vesica logomark (วงรอบ + สองวงซ้อน + จุดศูนย์กลาง) เคลื่อนไหวสื่อ "unity ของศาสตร์" — สองวงค่อย ๆ ซ้อนกันจนเกิดจุดตัด → จุดศูนย์สว่างขึ้น (loop ช้า ๆ)
- **Background pattern สาย**: vesica จาง ๆ ซ้ำเป็น pattern สำหรับ section สาย สีเปลี่ยนตาม cosmology (แนวคิด = Psyche, สำนัก = Mercurius) อ่านจาก `--cosmology-accent`

## 2. สถาปัตยกรรม

```
components/hero/
├── vesica-unity.tsx        ← client component, GSAP timeline ขับ hero animation
└── vesica-pattern.tsx      ← vesica pattern background (cosmology-aware)

app/globals.css             ← keyframe fallback + prefers-reduced-motion guard
app/page.tsx                ← แทรก <VesicaUnity> ที่ hero + <VesicaPattern> ที่ section สาย
```

## 3. Type-safety & การป้องกัน Type Error

- GSAP component เป็น `"use client"` แยกจาก server component
- ใช้ `useLayoutEffect` isomorphic (เช็ค `typeof window`) กัน hydration mismatch
- Cleanup timeline ใน `useEffect` return (กัน memory leak)
- `gsap.context()` สำหรับ scoped selection + revert
- ไม่มี metadata convention / `ImageResponse` มาเกี่ยว → type-safe โดยธรรมชาติ
- ref ใช้ `useRef<SVGSVGElement>(null)` ไม่เรียก `.current` ตอน render

## 4. VesicaUnity — Hero animation (GSAP)

**โครงสร้าง SVG** (reuse โครงจาก `<ArchronLogomark>` viewBox 0 0 48 48):
- วงรอบใหญ่ (อารยธรรม) — คงที่, opacity 0.4
- วงซ้าย + วงขวา (ศาสตร์สองสาย) — เริ่มแยก ค่อย ๆ เคลื่อนเข้าหา → ซ้อน
- จุดศูนย์กลาง (มนุษย์/unity) — pulse สว่างเมื่อวงซ้อนกัน
- จุดบน/ล่าง (ขอบเขต) — คงที่

**Timeline (loop ช้า ~6s):**
1. สองวงอยู่ไกลกัน (offset ±8px)
2. ค่อย ๆ เคลื่อนเข้าหา (`ease: "power2.inOut"`, `--dur-slow`)
3. ซ้อนกัน → จุดศูนย์ scale + opacity pulse
4. คงสถานะ unity ~1.5s
5. ค่อย ๆ แยก กลับเริ่มใหม่

**สี:** ใช้ `--cosmology-accent` (default Sapientia) ผ่าน `currentColor` หรือ inline style — สอดคล้อง Dynamic Colour

## 5. VesicaPattern — Background pattern สาย

**โครงสร้าง:** SVG vesica เล็ก ๆ จาง ๆ (opacity 0.04-0.08) เรียงเป็น grid ครอบ section

**Cosmology-aware:** อ่าน `--cosmology-accent` ของ section → pattern สีตามสาย:
- Section แนวคิด → Psyche (#6E93A8)
- Section สำนัก → Mercurius (#8AA395)
- Section บทความ → Sapientia (#CBA45A)

**Implementation:** 
- Server component ได้ (pure SVG + CSS, ไม่ต้อง JS)
- รับ prop `cosmology` หรืออ่าน `currentColor` จาก parent
- `pointer-events: none` + `aria-hidden`

## 6. Motion tokens & a11y

- ใช้ `--ease-soft`/`--ease-out`, `--dur-slow`/`--dur-ambient`
- `prefers-reduced-motion: reduce` → GSAP timeline ปิด (แสดงสถานะสุดท้าย static), pattern คงที่
- animation เฉพาะ `transform`/`opacity` (compositor-friendly)

## 7. Implementation Plan — 3 ขั้น

1. สร้าง `VesicaUnity` (client, GSAP) + `VesicaPattern` (server, SVG)
2. เพิ่ม CSS สนับสนุน + reduced-motion guard ใน globals.css
3. แทรกเข้า `app/page.tsx` (hero + section สาย) + verify build/lint

## 8. Guardrails
- ❌ ไม่แตะ global chrome (header/footer/template body)
- ❌ ไม่ประดิษฐ์สีนอก cosmology 6 ตัว
- ❌ ไม่ commit ถ้า build/lint ไม่เขียว (ยกเว้น pre-existing)
- ❌ ไม่ใช้ `any`
- ❌ GSAP timeline ต้อง cleanup เสมอ
