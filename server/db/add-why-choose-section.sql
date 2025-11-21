-- Add Why Choose section columns to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS why_choose_title TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS why_choose_description TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS feature_1_title TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS feature_1_description TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS feature_2_title TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS feature_2_description TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS feature_3_title TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS feature_3_description TEXT;
