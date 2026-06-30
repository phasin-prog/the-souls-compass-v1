-- supabase/migrations/20260630_table_editor_links.sql
-- Add foreign key constraints to link entries, profiles, comments, and page_views tables.

-- 1. Link entries (author_id) ➔ profiles (clerk_user_id)
ALTER TABLE public.entries 
ADD CONSTRAINT entries_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(clerk_user_id) 
ON DELETE RESTRICT;

-- 2. Link comments (clerk_user_id) ➔ profiles (clerk_user_id)
ALTER TABLE public.comments 
ADD CONSTRAINT comments_clerk_user_id_fkey 
FOREIGN KEY (clerk_user_id) REFERENCES public.profiles(clerk_user_id) 
ON DELETE CASCADE;

-- 3. Link comments (slug) ➔ entries (slug)
ALTER TABLE public.comments 
ADD CONSTRAINT comments_slug_fkey 
FOREIGN KEY (slug) REFERENCES public.entries(slug) 
ON DELETE CASCADE;

-- 4. Link page_views (slug) ➔ entries (slug)
ALTER TABLE public.page_views 
ADD CONSTRAINT page_views_slug_fkey 
FOREIGN KEY (slug) REFERENCES public.entries(slug) 
ON DELETE CASCADE;
