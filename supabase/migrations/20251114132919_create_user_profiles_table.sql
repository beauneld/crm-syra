/*
  # Create user_profiles table for role-based access control

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `profile_type` (text) - Admin, Manager+, Manager, Conseiller
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `photo_url` (text)
      - `team_manager_id` (uuid, nullable) - References another user_profile for team structure
      - `is_active` (boolean) - Whether this profile is currently active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for public read access (temporary for development)

  3. Indexes
    - Add index on profile_type for filtering
    - Add index on team_manager_id for team queries
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_type text NOT NULL CHECK (profile_type IN ('Admin', 'Manager+', 'Manager', 'Conseiller')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  photo_url text DEFAULT '/Retouched Azran Moche 2.jpeg',
  team_manager_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_profile_type ON user_profiles(profile_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_team_manager_id ON user_profiles(team_manager_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access for all profiles (temporary for development)
CREATE POLICY "Public read access for user_profiles"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

-- Policy: Public write access (temporary for development)
CREATE POLICY "Public write access for user_profiles"
  ON user_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public update access for user_profiles"
  ON user_profiles FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trigger_update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Insert default profiles for testing
INSERT INTO user_profiles (profile_type, first_name, last_name, email, is_active, photo_url)
VALUES 
  ('Admin', 'Mandjé', 'Lebel', 'mandje.lebel@bienviyance.com', false, '/Retouched Azran Moche 2.jpeg'),
  ('Manager+', 'Moche', 'Azran', 'moche.azran@bienviyance.com', true, '/Retouched Azran Moche 2.jpeg'),
  ('Manager', 'Benjamin', 'Zaoui', 'benjamin.zaoui@bienviyance.com', false, '/Retouched Azran Moche 2.jpeg'),
  ('Conseiller', 'Ornella', 'Attard', 'ornella.attard@bienviyance.com', false, '/Retouched Azran Moche 2.jpeg')
ON CONFLICT DO NOTHING;
