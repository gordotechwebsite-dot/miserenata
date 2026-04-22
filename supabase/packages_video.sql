-- Add video + video cover (poster) support to packages table.
-- Run this once in the Supabase SQL editor before using the admin upload.

alter table public.packages
  add column if not exists video_url text,
  add column if not exists video_path text,
  add column if not exists video_poster_url text,
  add column if not exists video_poster_path text;
