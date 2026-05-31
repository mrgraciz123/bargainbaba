-- Safely add missing columns to the wedding_projects table if they do not exist
-- This ensures the backend and Supabase schema remain in sync.

ALTER TABLE wedding_projects
ADD COLUMN IF NOT EXISTS venue_type TEXT,
ADD COLUMN IF NOT EXISTS catering TEXT;
