-- supabase/migrations/20260629_add_cover_image.sql
-- Add cover_image column to entries table
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS cover_image text;
