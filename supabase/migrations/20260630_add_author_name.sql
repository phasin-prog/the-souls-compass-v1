-- Add author_name column to entries table
-- Stores the display_name at write time so cards can show it without joining profiles

alter table public.entries
  add column if not exists author_name text;

create index if not exists entries_author_name_idx on public.entries (author_name);
