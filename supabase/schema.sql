-- =========================================================
-- Archron — Database Schema (Supabase SQL Editor)
-- =========================================================
-- Architecture — 3 systems:
--   Database = Supabase (PostgreSQL + RLS)  <-- this file
--   Storage  = Cloudflare R2 (private bucket) -> images via /api/media proxy
--       cover_image stores URL pointing to /api/media/uploads/...
--   Cache    = Upstash Redis (TTL 300s) -> lib/content/public-source.ts
--       keys: archron:cache:entries:published / entry:<slug>
--
-- How to run: copy this whole file -> Supabase Dashboard > SQL Editor > New query > Run
-- Idempotent: safe to re-run (uses if not exists / drop policy if exists)
--
-- RLS:
--   published  -> anyone can read (anon + authenticated)
--   draft      -> only owner (author_id = Clerk user id)
--   Studio writes use service-role (bypass RLS) + ownership check in data layer
--     (lib/content/server-auth.ts -> getAuthedSupabase)
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- 1) entries -- Studio-Editor content table (ALL fields)
-- =========================================================
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                       -- EditorDraft.slug
  title text not null,                             -- EditorDraft.title
  status text not null default 'draft',            -- draft | needs-source-check | ready-to-publish | published | archived
  content_type text not null default 'article',    -- article | concept | reading-set | source-note | person | book | school | symbol | term
  author_id text not null,                         -- Clerk user id (set by server-auth)

  -- identity block (concept identity; DB-ready, editor form not yet wired)
  main_term text,
  thai_name text,
  original_term text,
  part_of_speech text,
  language_root text,
  ipa text,
  short_description text,

  -- framework / theory
  framework text,                                  -- EditorDraft.framework
  main_thinkers text[],                            -- EditorDraft.mainThinker -> [mainThinker]
  school text,                                     -- ContentEntry.school (DB-ready)
  difficulty text,                                 -- beginner | intermediate | advanced | source-note
  tags text[],                                     -- EditorDraft.tags

  -- content (reading body)
  visual_explanation text,                         -- EditorDraft.visualExplanation
  technical_meaning text,                          -- EditorDraft.technicalMeaning
  body_markdown text,                              -- EditorDraft.bodyMarkdown
  cover_image text,                                -- R2 URL or null (EditorDraft.coverImage)

  -- structured (jsonb)
  roots jsonb,                                     -- { etymology, historicalUsage, meaningShift, caution }
  related_concepts jsonb not null default '[]'::jsonb,  -- [{ conceptSlug, relationType, reason }]
  source_refs jsonb not null default '[]'::jsonb,  -- [{ sourceType, title, relatedClaim }] (avoid reserved word)
  related_cta jsonb,                               -- { articleSlugs, conceptSlugs, readingSetSlugs, sourceNoteSlugs, showConstellationMap }

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz                         -- set on first publish (publishEntry preserves original)
);

-- =========================================================
-- 2) entry_revisions -- version history (Studio Editor snapshots)
-- =========================================================
create table if not exists public.entry_revisions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  snapshot jsonb not null,
  created_by text not null,
  note text,
  created_at timestamptz not null default now()
);
-- =========================================================
-- 3) Indexes
-- =========================================================
create index if not exists entries_author_idx on public.entries (author_id);
create index if not exists entries_status_idx on public.entries (status);
create index if not exists entries_slug_idx on public.entries (slug);
create index if not exists rev_entry_idx on public.entry_revisions (entry_id);

-- =========================================================
-- 4) updated_at trigger
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

-- =========================================================
-- 5) RLS -- entries + entry_revisions (auth.jwt() = Clerk user id)
-- auth.jwt()->>'sub' = Clerk user id (ผ่าน Supabase Third-Party Auth / Clerk)
-- =========================================================
alter table public.entries enable row level security;
alter table public.entry_revisions enable row level security;

-- อ่าน: published เปิดทุกคน, ฉบับร่างเห็นเฉพาะเจ้าของ
drop policy if exists entries_select on public.entries;
create policy entries_select on public.entries
  for select using (
    status = 'published' or author_id = (auth.jwt()->>'sub')
  );

-- สร้าง: author_id ต้องเป็นตัวเอง
drop policy if exists entries_insert on public.entries;
create policy entries_insert on public.entries
  for insert with check (author_id = (auth.jwt()->>'sub'));

-- แก้: เฉพาะของตัวเอง
drop policy if exists entries_update on public.entries;
create policy entries_update on public.entries
  for update using (author_id = (auth.jwt()->>'sub'))
  with check (author_id = (auth.jwt()->>'sub'));

-- ลบ: เฉพาะของตัวเอง
drop policy if exists entries_delete on public.entries;
create policy entries_delete on public.entries
  for delete using (author_id = (auth.jwt()->>'sub'));

-- revisions: จัดการได้เฉพาะ entry ของตัวเอง
drop policy if exists rev_all_own on public.entry_revisions;
create policy rev_all_own on public.entry_revisions
  for all using (
    exists (
      select 1 from public.entries e
      where e.id = entry_id and e.author_id = (auth.jwt()->>'sub')
    )
  )
  with check (created_by = (auth.jwt()->>'sub'));

-- =========================================================
-- 6) profiles -- reader/writer profile (role stored in Clerk publicMetadata)


-- =========================================================
create table if not exists public.profiles (
  clerk_user_id text primary key,                -- Clerk user id (JWT sub)
  username text unique,                           -- ชื่อผู้ใช้เฉพาะของเว็บ
  display_name text,                              -- ชื่อที่แสดง
  title text,                                     -- ยศ/ตำแหน่ง เช่น ผู้สนับสนุน
  writer_request boolean not null default false, -- ผู้ใช้ขอเป็นนักเขียน (รออนุมัติ)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- อ่าน: เปิดสาธารณะ (username/ยศ ใช้แสดงผลได้ทั่วไป — ไม่เก็บข้อมูลอ่อนไหว)
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (true);

-- สร้าง/แก้: เฉพาะโปรไฟล์ของตัวเอง
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (clerk_user_id = (auth.jwt()->>'sub'));

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

-- =========================================================
-- 7) comments -- article/concept comments (login required)
-- section = 'articles' | 'concepts'  ยท  slug = entry slug
-- =========================================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  section text not null,                          -- articles | concepts
  slug text not null,                             -- entry slug
  clerk_user_id text not null,                    -- Clerk user id (JWT sub)
  author_name text,                              -- ชื่อที่แสดง ณ ตอนคอมเมนต์
  body text not null,
  status text not null default 'visible',         -- visible | hidden (สำหรับโมเดอเรชัน)
  created_at timestamptz not null default now()
);

create index if not exists comments_target_idx on public.comments (section, slug, created_at);
create index if not exists comments_user_idx on public.comments (clerk_user_id);

alter table public.comments enable row level security;

-- อ่าน: คอมเมนต์ที่ visible เปิดสาธารณะ (เจ้าของเห็นของตนเองทุกสถานะ)
drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments
  for select using (status = 'visible' or clerk_user_id = (auth.jwt()->>'sub'));

-- สร้าง: ต้องเป็นผู้ใช้ที่ล็อกอิน และเป็นตัวเอง
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
  for insert with check (clerk_user_id = (auth.jwt()->>'sub'));

-- แก้/ลบ: เฉพาะของตัวเอง (โมเดอเรชันของแอดมินทำผ่าน service role แยกภายหลัง)
drop policy if exists comments_update on public.comments;
create policy comments_update on public.comments
  for update using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments
  for delete using (clerk_user_id = (auth.jwt()->>'sub'));

-- =========================================================
-- 8) page_views -- visit counter (per slug + total, via SECURITY DEFINER RPC)

-- =========================================================
create table if not exists public.page_views (
  slug text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

-- อ่าน: เปิดสาธารณะ (ใช้แสดงจำนวน)
drop policy if exists page_views_select on public.page_views;
create policy page_views_select on public.page_views
  for select using (true);

-- เพิ่มยอดเข้าชม +1 (upsert) — คืนค่ายอดล่าสุด
create or replace function public.increment_page_view(p_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_views bigint;
begin
  insert into public.page_views (slug, views, updated_at)
  values (p_slug, 1, now())
  on conflict (slug)
  do update set views = public.page_views.views + 1, updated_at = now()
  returning views into new_views;
  return new_views;
end; $$;

-- ยอดผู้เยี่ยมชมรวมทั้งเว็บ
create or replace function public.total_page_views()
returns bigint
language sql
security definer
set search_path = public
as $$
  select coalesce(sum(views), 0)::bigint from public.page_views;
$$;

grant execute on function public.increment_page_view(text) to anon, authenticated;
grant execute on function public.total_page_views() to anon, authenticated;


-- =========================================================
-- 9) Foreign key links -- connect comments & page_views to entries
--    NOTE: deleting an entry cascades to its comments + views
--    NOTE: commenting requires an entry row to exist (FK constraint)
-- =========================================================
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'comments_slug_fkey' and table_name = 'comments'
  ) then
    alter table public.comments
    add constraint comments_slug_fkey
    foreign key (slug) references public.entries(slug)
    on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'page_views_slug_fkey' and table_name = 'page_views'
  ) then
    alter table public.page_views
    add constraint page_views_slug_fkey
    foreign key (slug) references public.entries(slug)
    on delete cascade;
  end if;
end $$;

-- =========================================================
-- 10) Grants -- allow anon + authenticated to use RLS-protected tables
--     (RLS still enforces row-level access; grants enable table-level access)
-- =========================================================
grant select on public.entries to anon, authenticated;
grant insert, update, delete on public.entries to authenticated;
grant select, insert, update, delete on public.entry_revisions to authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.comments to anon, authenticated;
grant insert, update, delete on public.comments to authenticated;
grant select on public.page_views to anon, authenticated;

-- =========================================================
-- END -- Run this file in Supabase SQL Editor to set up the full DB
--       DB=Supabase (this)  Storage=Cloudflare R2  Cache=Upstash Redis
-- =========================================================
-- =========================================================
-- ===== Reading Progress & Achievements (additive) =====
-- ADDITIVE ONLY — ต่อท้ายไฟล์เดิม ไม่แก้ statement เดิมด้านบน
-- ยึดแพตเทิร์นเดิม: RLS ผูก auth.jwt()->>'sub' = clerk_user_id (เหมือน profiles/comments)
-- ใช้ create table if not exists + drop policy if exists (idempotent เหมือนทั้งไฟล์)
-- =========================================================

-- ---------------------------------------------------------
-- 11) reading_progress -- ความคืบหน้าการอ่านรายบุคคล (per-user, per-slug)
--     ต่างจาก page_views (aggregate ต่อ slug) — ตารางนี้เป็นข้อมูลส่วนบุคคล
--     status: 'reading' | 'completed' · progress 0–100
--     Level คำนวณ (derive) จาก COUNT(status='completed') ทุกครั้ง — ไม่ cache
-- ---------------------------------------------------------
create table if not exists public.reading_progress (
  clerk_user_id text not null,                    -- Clerk user id (JWT sub)
  slug text not null,                             -- entry slug
  content_type text not null default 'article',   -- article | concept | person | book | school | symbol | term | reading-set | source-note
  status text not null default 'reading',         -- reading | completed
  progress smallint not null default 0,           -- 0–100
  first_read_at timestamptz default now(),
  completed_at timestamptz,
  updated_at timestamptz default now(),
  primary key (clerk_user_id, slug)
);

create index if not exists reading_progress_user_status_idx
  on public.reading_progress (clerk_user_id, status);

alter table public.reading_progress enable row level security;

-- อ่าน: เฉพาะแถวของตน (ข้อมูลส่วนบุคคล — โปรไฟล์เป็น private เท่านั้น)
drop policy if exists reading_progress_select on public.reading_progress;
create policy reading_progress_select on public.reading_progress
  for select using (clerk_user_id = (auth.jwt()->>'sub'));

-- สร้าง: เฉพาะแถวของตน
drop policy if exists reading_progress_insert on public.reading_progress;
create policy reading_progress_insert on public.reading_progress
  for insert with check (clerk_user_id = (auth.jwt()->>'sub'));

-- แก้: เฉพาะแถวของตน
drop policy if exists reading_progress_update on public.reading_progress;
create policy reading_progress_update on public.reading_progress
  for update using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

-- ลบ: เฉพาะแถวของตน
drop policy if exists reading_progress_delete on public.reading_progress;
create policy reading_progress_delete on public.reading_progress
  for delete using (clerk_user_id = (auth.jwt()->>'sub'));

-- updated_at trigger (ใช้ฟังก์ชัน set_updated_at() ที่ประกาศไว้แล้วด้านบน)
drop trigger if exists reading_progress_set_updated_at on public.reading_progress;
create trigger reading_progress_set_updated_at
  before update on public.reading_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- 12) user_achievements -- เหรียญตรา/ความสำเร็จที่ปลดล็อก (per-user)
--     achievement_key ตรงกับ ACHIEVEMENTS catalog ใน lib/content/achievements.ts
-- ---------------------------------------------------------
create table if not exists public.user_achievements (
  clerk_user_id text not null,                    -- Clerk user id (JWT sub)
  achievement_key text not null,                  -- first-read | explorer-10 | cross-schools-5 | streak-7 | deep-50 | manifesto
  unlocked_at timestamptz default now(),
  primary key (clerk_user_id, achievement_key)
);

create index if not exists user_achievements_user_idx
  on public.user_achievements (clerk_user_id);

alter table public.user_achievements enable row level security;

-- อ่าน: เฉพาะของตน
drop policy if exists user_achievements_select on public.user_achievements;
create policy user_achievements_select on public.user_achievements
  for select using (clerk_user_id = (auth.jwt()->>'sub'));

-- สร้าง: เฉพาะของตน
drop policy if exists user_achievements_insert on public.user_achievements;
create policy user_achievements_insert on public.user_achievements
  for insert with check (clerk_user_id = (auth.jwt()->>'sub'));

-- แก้: เฉพาะของตน
drop policy if exists user_achievements_update on public.user_achievements;
create policy user_achievements_update on public.user_achievements
  for update using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

-- ลบ: เฉพาะของตน
drop policy if exists user_achievements_delete on public.user_achievements;
create policy user_achievements_delete on public.user_achievements
  for delete using (clerk_user_id = (auth.jwt()->>'sub'));

-- ---------------------------------------------------------
-- 13) Grants -- เปิด table-level access (RLS ยังบังคับ row-level เหมือนตารางอื่น)
-- ---------------------------------------------------------
grant select, insert, update, delete on public.reading_progress to authenticated;
grant select, insert, update, delete on public.user_achievements to authenticated;

-- =========================================================
-- END -- Reading Progress & Achievements (additive)
-- =========================================================
