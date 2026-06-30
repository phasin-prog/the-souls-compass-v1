-- Drop the FK constraint on entries.author_id that references profiles.clerk_user_id
-- author_id is a Clerk user id, managed by Clerk — no need for Supabase FK enforcement
-- This constraint prevents saving entries when the user has no profile row

alter table public.entries
  drop constraint if exists entries_author_id_fkey;
