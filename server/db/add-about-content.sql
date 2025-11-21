-- Add about_content column to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS about_content TEXT;
