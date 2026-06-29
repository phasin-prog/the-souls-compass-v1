# 📖 สารบัญโค้ด ARCHRON (Code Index / Library)

> จุดเริ่มต้นอ่านโค้ดทั้งโปรเจกต์ — รวมทุกไฟล์สำคัญพร้อมหน้าที่ จัดกลุ่มตามระบบ
> อัปเดตให้ตรงกับสถานะล่าสุด (ARCHRON · Cosmology v2 DARK · Dynamic Typography · ICON LANGUAGE · Roles · Reading systems A1–A3)
> ภาพรวมระบบ/ดีไซน์ดูที่ [`../README.md`](../README.md)

สแตก: Next.js 16 (App Router/RSC/ISR) · React 19 · Tailwind v4 · Supabase (RLS) · Clerk

---

## 1) App Router — หน้าสาธารณะ (`app/`)

| ไฟล์ | หน้าที่ |
|---|---|
| `app/layout.tsx` | Root layout — โหลดฟอนต์ (Inter, IBM Plex Serif, Noto Serif/Sans Thai, IBM Plex Sans Thai, Cinzel, Playfair) + Material Symbols, mount SiteHeader/Footer, AccentController, accent-aura, Tabbar, Fab, ScrollToTop |
| `app/template.tsx` | เอฟเฟกต์เปลี่ยนหน้า (route transition / fade) |
| `app/globals.css` | ระบบดีไซน์ทั้งหมด — Cosmology v2 tokens, `@property --accent` (Dynamic Accent), Dynamic Typography (fluid clamp), `.md-body`, Citation/Glossary/footnote styles |
| `app/page.tsx` | หน้าแรก — hero, เสาหลัก, ATLAS 6 หมวด (ICON LANGUAGE + สี cosmology), คำประกาศ, ทางลัด |
| `app/knowledge/page.tsx` | สารบัญคลังความรู้ — การ์ดนำทาง (ไอคอนลายเส้น ARCHRON) |
| `app/articles/page.tsx` · `app/articles/[slug]/page.tsx` | รายการบทความ + หน้าอ่านบทความ (ดึง DB → fallback static, ISR) |
| `app/concepts/page.tsx` · `app/concepts/[slug]/page.tsx` | รายการแนวคิด/Wiki + หน้า node รายตัว |
| `app/constellation/page.tsx` | แผนที่ความสัมพันธ์ (กราฟ node) |
| `app/reading-sets/page.tsx` | ซีรีส์/เส้นทางการอ่าน |
| `app/sources/page.tsx` | ฐานข้อมูลแหล่งอ้างอิง |
| `app/schools/page.tsx` | สำนักคิดและนักปราชญ์ (wrapper เรียก SchoolsHub) |
| `app/external-links/page.tsx` | ทรัพยากรภายนอก |
| `app/faq/page.tsx` | คำถามที่พบบ่อย |
| `app/manifesto/page.tsx` | ปฏิญญาก่อตั้ง ARCHRON |
| `app/support/page.tsx` | สนับสนุนโครงการ |
| `app/search/page.tsx` | หน้าค้นหา (เรียก search-client) |
| `app/guide/page.tsx` | บริการ Jungian Type Analysis |

## 2) App Router — Studio (เขียน/ดูแล) (`app/studio/`)

| ไฟล์ | หน้าที่ |
|---|---|
| `app/studio/layout.tsx` | chrome เฉพาะ Studio (ซ่อน header/footer สาธารณะ) |
| `app/studio/page.tsx` | Landing/Login นักเขียน (Clerk SignIn ธีมมืด) |
| `app/studio/editor/page.tsx` | ตัวแก้ไขเนื้อหา — autosave, version, markdown, dropdown icon+สี, mobile action bar, feedback toast |
| `app/studio/editor/actions.ts` | Server actions ของ editor (บันทึก/เผยแพร่ + revalidatePath) |
| `app/studio/profile/page.tsx` | โปรไฟล์ตนเอง (username/display/title) + ขอเป็นนักเขียน |
| `app/studio/users/page.tsx` · `users/actions.ts` | จัดการผู้ใช้ (admin) + server actions ตั้งบทบาทผ่าน clerkClient |
| `app/studio/comments/page.tsx` · `comments/actions.ts` | โมเดอเรชันคอมเมนต์ (admin) — ซ่อน/แสดง/ลบ; server actions ตรวจ role + service-role client |

## 3) App Router — บัญชีนักอ่าน (`app/th/`)

| ไฟล์ | หน้าที่ |
|---|---|
| `app/th/layout.tsx` | layout ฝั่งบัญชี (Clerk) |
| `app/th/login/[[...login]]/page.tsx` | เข้าสู่ระบบ "บัญชีนักอ่าน" |
| `app/th/register/[[...register]]/page.tsx` | สมัครบัญชีนักอ่าน |

---

## 4) Components — โครงร่าง/Chrome ทั้งเว็บ

| ไฟล์ | หน้าที่ |
|---|---|
| `components/site-header.tsx` | glass-nav (sticky) + เมนูมือถือ + ปุ่ม Studio (ซ่อนใน /studio) |
| `components/site-footer.tsx` | footer (ซ่อนใน /studio) |
| `components/accent-controller.tsx` | ตั้งค่า `--accent` ตามเส้นทาง (Dynamic Accent) |
| `components/tabbar.tsx` · `components/fab.tsx` · `components/scroll-to-top.tsx` | แถบล่างมือถือ / ปุ่มลอย / ปุ่มเลื่อนขึ้น (ซ่อนใน /studio) |
| `components/scroll-reveal.tsx` | เผยเนื้อหาเมื่อเลื่อนถึง (IntersectionObserver, progressive enhancement) |
| `components/page-header.tsx` · `components/page-nav.tsx` | ส่วนหัวหน้า / นำทาง-breadcrumb ที่ใช้ซ้ำ |

## 5) Components — ภาษาไอคอน & แบรนด์

| ไฟล์ | หน้าที่ |
|---|---|
| `components/icons.tsx` | ชุดไอคอน: ARCHRON logomark/mark, UI icons, และ **ICON LANGUAGE 12 ศาสตร์** (ในวงแหวน) |
| `components/discipline-meta.tsx` | แม็ปศาสตร์ → ไอคอน ICON LANGUAGE + สี cosmology + ป้ายไทย (แหล่งกลาง) |

## 6) Components — ประสบการณ์การอ่าน (`components/reading/`)

| ไฟล์ | หน้าที่ |
|---|---|
| `reading-page.tsx` | หน้าอ่าน Unified (article/concept) — header, meta-grid, markdown, related, references; ฝัง **Citation (A1)** + **Glossary (A2)** |
| `reading-toc.tsx` | สารบัญลอย + scroll-spy (A3) |
| `reading-progress.tsx` | แถบความคืบหน้าการอ่าน (A3) |
| `reading-dock.tsx` | แถบเครื่องมือหน้าอ่าน (คัดลอก/แผนที่/พิมพ์) |
| `internal-link-text.tsx` | render ข้อความที่มี `[[ ]]` เป็นลิงก์จริง (ตรวจ dead link) |
| `internal-concept-link.tsx` | ลิงก์ concept + **Glossary hover (A2)** + เมนูลัด wiki |
| `view-counter.tsx` | ตัวนับผู้เยี่ยมชมต่อบทความ (นับ +1 ครั้ง/session ผ่าน RPC) |
| `comment-section.tsx` | ระบบความคิดเห็นท้ายบทความ (account-gated; ครอบ ClerkProvider เป็น island) |

## 7) Components — Studio editor (`components/studio/`)

| ไฟล์ | หน้าที่ |
|---|---|
| `searchable-select.tsx` · `searchable-multi-select.tsx` | dropdown ค้นหาได้ (รองรับ icon+สี, สร้างค่าใหม่) / เลือกหลายค่า |
| `related-concept-picker.tsx` | เลือกแนวคิดที่เกี่ยวข้องจาก Concept Registry |
| `internal-link-suggestion-panel.tsx` | แนะนำ `[[ ]]` internal link ระหว่างเขียน |
| `my-content-search.tsx` | ค้นหาเนื้อหาของฉัน |
| `revision-panel.tsx` | แผงประวัติเวอร์ชัน (กู้คืน snapshot) |
| `feedback-toast.tsx` | Pop-up feedback (สำเร็จ/ผิดพลาด) |

## 8) Components — โดเมนเฉพาะ & UI primitives

| ไฟล์ | หน้าที่ |
|---|---|
| `components/schools/schools-hub.tsx` | ไดเรกทอรีสำนักคิด — ค้นหา/ดัชนี A–Z, ไอคอน+สีประจำศาสตร์, modal นักคิด |
| `components/concepts/concept-card.tsx` | การ์ดแนวคิด |
| `components/constellation/constellation-mindmap.tsx` | กราฟ mindmap ความสัมพันธ์ |
| `components/external-links/external-links-browser.tsx` | เบราว์เซอร์ทรัพยากรภายนอก |
| `components/search/search-client.tsx` | UI ค้นหา (client) |
| `components/accordion.tsx` · `components/tooltip.tsx` · `components/context-menu.tsx` | accordion / tooltip / เมนูคลิกขวา-กดค้าง |
| `components/view-badge.tsx` | ป้ายจำนวนวิวบนการ์ด list (แสดงอย่างเดียว, ดึงแบบ batch, ซ่อนเมื่อ 0) |

---

## 9) Domain & Data (`lib/content/`)

| ไฟล์ | หน้าที่ |
|---|---|
| `concept-registry.ts` | ฐานกลางของ node (concept/person/book/school/symbol/term) + นิยามสั้น (ใช้โดย related, backlinks, internal links, Glossary) |
| `entries.ts` | เนื้อหา seed (fallback static) |
| `entries-db.ts` · `entry-mapper.ts` | ดึง entries จาก Supabase + แปลง row ↔ โมเดล |
| `draft-db.ts` · `draft-mapper.ts` | ร่างใน Studio ↔ DB |
| `public-source.ts` | ดึงเฉพาะ published + fallback ไป seed (ใช้โดยหน้าสาธารณะ) |
| `publish-validation.ts` | Publish checklist + ตรวจลิงก์เสีย |
| `internal-links.ts` | parse `[[wikilink]]` + ตรวจปลายทาง |
| `related.ts` | related concepts + backlinks |
| `graph.ts` | สร้างข้อมูลกราฟ Constellation |
| `search-index.ts` | ดัชนีค้นหา |
| `cosmology.ts` | Dynamic Accent (routeAccent), meta ของ content-type/status/difficulty/source/framework |
| `roles.ts` | บทบาท admin/writer/user (อ่านจาก Clerk metadata) |
| `profile-db.ts` | โปรไฟล์ผู้ใช้ (Supabase profiles) |
| `schools.ts` | ข้อมูลสำนักคิด + field ศาสตร์ |
| `comments-db.ts` | ความคิดเห็น (list/add/delete) ผ่าน RLS |
| `views-db.ts` | ตัวนับผู้เยี่ยมชม (increment/get/total) ผ่าน RPC |
| `external-links.ts` · `faq.ts` | ข้อมูลทรัพยากรภายนอก / FAQ |

## 10) Supabase / Types / Config

| ไฟล์ | หน้าที่ |
|---|---|
| `lib/supabase/client.ts` | Supabase client ฝั่ง browser (แนบ Clerk token) |
| `lib/supabase/server.ts` | Supabase client ฝั่ง server — `createServerSupabase` (anon) + `createServiceSupabase` (service-role, ข้าม RLS, ใช้ใน admin actions) |
| `types/content.ts` | โมเดลเนื้อหา (ContentEntry, SourceItem, RelationType, Difficulty ฯลฯ) |
| `supabase/schema.sql` | ตาราง `entries` · `entry_revisions` · `profiles` · `comments` · `page_views` + RLS + RPC (`increment_page_view`, `total_page_views`) |
| `middleware.ts` | ป้องกันเส้นทาง (Clerk) เฉพาะ /studio/editor, /studio/users, /studio/comments |
| `next.config.mjs` | ตั้งค่า Next.js |

---

## 11) ระบบหลัก → ไฟล์ที่เกี่ยวข้อง (System Map)

| ระบบ | ไฟล์หลัก |
|---|---|
| Cosmology v2 (DARK) + Dynamic Accent | `app/globals.css`, `lib/content/cosmology.ts`, `components/accent-controller.tsx` |
| Dynamic Typography (fluid clamp) | `app/layout.tsx`, `app/globals.css` |
| ICON LANGUAGE (12 ศาสตร์) | `components/icons.tsx`, `components/discipline-meta.tsx` (ใช้ใน `app/page.tsx`, `schools-hub`, `knowledge`) |
| Roles & Auth | `lib/content/roles.ts`, `middleware.ts`, `app/studio/*`, `lib/supabase/*` |
| Wiki / Knowledge Graph | `concept-registry.ts`, `internal-links.ts`, `related.ts`, `graph.ts`, `constellation-mindmap.tsx` |
| Reading A3 (TOC/Progress) | `reading-toc.tsx`, `reading-progress.tsx` |
| Reading A1 (Citation `[[cite:N]]`) | `reading-page.tsx` (`citeify`), `app/globals.css` |
| Reading A2 (Glossary hover) | `internal-concept-link.tsx`, `reading-page.tsx` (mdComponents) |
| ความคิดเห็น (Comments) | `comments-db.ts`, `comment-section.tsx`, `reading-page.tsx`, `supabase/schema.sql` (comments) |
| ตัวนับผู้เยี่ยมชม (Views) | `views-db.ts`, `view-counter.tsx` (รายชิ้น), `view-badge.tsx` (การ์ด), `site-footer.tsx` (รวม), `schema.sql` (page_views + RPC) |
| โมเดอเรชันคอมเมนต์ (Admin) | `app/studio/comments/*`, `lib/supabase/server.ts` (`createServiceSupabase`), `lib/content/roles.ts` |

---

## 12) Environment ที่ต้องตั้ง

| ตัวแปร | ใช้ทำอะไร |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` | เชื่อม Supabase (อ่าน published, คอมเมนต์, นับวิว) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` · `CLERK_SECRET_KEY` | Auth (Studio, บัญชีนักอ่าน, คอมเมนต์) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server-only** — ใช้เฉพาะโมเดอเรชันคอมเมนต์ของแอดมิน (ข้าม RLS) · ห้ามใส่ prefix `NEXT_PUBLIC_` |

> หลังเพิ่มตารางใหม่ ต้องรัน `supabase/schema.sql` ใน Supabase SQL Editor ก่อน ระบบคอมเมนต์/ตัวนับวิวจึงทำงาน

---

*ปรับสารบัญนี้ทุกครั้งที่เพิ่ม/ย้าย/ลบไฟล์สำคัญ เพื่อให้เป็นแผนที่โค้ดที่เชื่อถือได้*
