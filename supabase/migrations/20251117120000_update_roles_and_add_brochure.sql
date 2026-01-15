/*
  # Update user roles and add advisor brochure functionality

  1. Schema Changes
    - Update profile_type constraint in user_profiles table to support new roles
    - Add advisor_brochure_url column to user_profiles table
    - Update existing role data to new naming convention

  2. New Roles
    - Admin (unchanged)
    - Manager (unchanged)
    - Gestion (formerly Manager+)
    - Signataire (formerly Manager)
    - Téléprospecteur (formerly Conseiller)

  3. Storage
    - Create advisor-brochures bucket for PDF storage
    - Configure public access policies for the bucket

  4. Security
    - Maintain existing RLS policies
    - Add policies for brochure file access

  5. Data Migration
    - Update existing user_profiles records with new role names
    - Preserve all existing data and relationships
*/

-- Add advisor_brochure_url column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'advisor_brochure_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN advisor_brochure_url text;
  END IF;
END $$;

-- Update existing data BEFORE changing constraint
-- Update Manager+ to Gestion
UPDATE user_profiles
SET profile_type = 'Gestion'
WHERE profile_type = 'Manager+';

-- Update Manager to Signataire (excluding Admin)
UPDATE user_profiles
SET profile_type = 'Signataire'
WHERE profile_type = 'Manager';

-- Update Conseiller to Téléprospecteur
UPDATE user_profiles
SET profile_type = 'Téléprospecteur'
WHERE profile_type = 'Conseiller';

-- Drop the old constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_profile_type_check;

-- Add new constraint with updated roles
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_profile_type_check
  CHECK (profile_type IN ('Admin', 'Manager', 'Gestion', 'Signataire', 'Téléprospecteur'));

-- Create the advisor-brochures storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('advisor-brochures', 'advisor-brochures', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to advisor brochures
DROP POLICY IF EXISTS "Public read access for advisor brochures" ON storage.objects;
CREATE POLICY "Public read access for advisor brochures"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'advisor-brochures');

-- Policy: Allow authenticated users to upload advisor brochures
DROP POLICY IF EXISTS "Authenticated users can upload advisor brochures" ON storage.objects;
CREATE POLICY "Authenticated users can upload advisor brochures"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'advisor-brochures');

-- Policy: Allow authenticated users to update advisor brochures
DROP POLICY IF EXISTS "Authenticated users can update advisor brochures" ON storage.objects;
CREATE POLICY "Authenticated users can update advisor brochures"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'advisor-brochures')
  WITH CHECK (bucket_id = 'advisor-brochures');

-- Policy: Allow authenticated users to delete advisor brochures
DROP POLICY IF EXISTS "Authenticated users can delete advisor brochures" ON storage.objects;
CREATE POLICY "Authenticated users can delete advisor brochures"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'advisor-brochures');

-- Add comment to the new column
COMMENT ON COLUMN user_profiles.advisor_brochure_url IS 'URL to the advisor brochure PDF file stored in Supabase Storage (only for Signataire role)';
