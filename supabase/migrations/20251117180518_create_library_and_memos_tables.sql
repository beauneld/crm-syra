/*
  # Create Library Documents and Memos Tables
  
  1. New Tables
    - `library_documents`
      - `id` (uuid, primary key)
      - `organization_id` (text, not null)
      - `title` (text, not null)
      - `file_url` (text, not null) - Storage path to PDF file
      - `file_name` (text, not null) - Original filename
      - `file_size` (bigint, not null) - File size in bytes
      - `category` (text, not null) - Either 'PER' or 'Assurance Vie'
      - `uploaded_by` (uuid, not null) - Reference to user_profiles.id
      - `uploaded_at` (timestamptz, default now())
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `memos`
      - `id` (uuid, primary key)
      - `organization_id` (text, not null)
      - `user_id` (uuid, not null) - Reference to user_profiles.id
      - `title` (text, not null)
      - `description` (text, nullable) - Optional memo description
      - `due_date` (date, not null) - Date the memo is due
      - `due_time` (time, not null) - Time the memo is due
      - `status` (text, default 'pending') - Either 'pending' or 'completed'
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on both tables
    - library_documents: All can read, Admin/Manager/Gestion/Marketing can write
    - memos: Users see their own memos only
  
  3. Indexes
    - Index on category for library_documents
    - Index on due_date and status for memos
  
  4. Profile Type Update
    - Add 'Marketing' to user_profiles profile_type CHECK constraint
    - Insert Philippine Bachelier profile
*/

-- Create library_documents table
CREATE TABLE IF NOT EXISTS library_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  category text NOT NULL CHECK (category IN ('PER', 'Assurance Vie')),
  uploaded_by uuid NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create memos table
CREATE TABLE IF NOT EXISTS memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  due_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_library_documents_category ON library_documents(category);
CREATE INDEX IF NOT EXISTS idx_library_documents_organization ON library_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_memos_due_date ON memos(due_date);
CREATE INDEX IF NOT EXISTS idx_memos_status ON memos(status);
CREATE INDEX IF NOT EXISTS idx_memos_user_id ON memos(user_id);

-- Enable Row Level Security
ALTER TABLE library_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for library_documents
-- Everyone can read documents
CREATE POLICY "Anyone can view library documents"
  ON library_documents FOR SELECT
  TO authenticated
  USING (true);

-- Only Admin, Manager, Gestion, Marketing can insert documents
CREATE POLICY "Admin, Manager, Gestion, Marketing can upload documents"
  ON library_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.profile_type IN ('Admin', 'Manager', 'Gestion', 'Marketing')
    )
  );

-- Only Admin, Manager, Gestion, Marketing can delete documents
CREATE POLICY "Admin, Manager, Gestion, Marketing can delete documents"
  ON library_documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.profile_type IN ('Admin', 'Manager', 'Gestion', 'Marketing')
    )
  );

-- RLS Policies for memos
-- Users can view their own memos
CREATE POLICY "Users can view own memos"
  ON memos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create their own memos
CREATE POLICY "Users can create own memos"
  ON memos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own memos
CREATE POLICY "Users can update own memos"
  ON memos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own memos
CREATE POLICY "Users can delete own memos"
  ON memos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Update user_profiles CHECK constraint to include Marketing
DO $$
BEGIN
  -- Drop the existing constraint
  ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_profile_type_check;
  
  -- Add the new constraint with Marketing included
  ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_profile_type_check 
    CHECK (profile_type = ANY (ARRAY['Admin'::text, 'Manager'::text, 'Gestion'::text, 'Signataire'::text, 'Téléprospecteur'::text, 'Marketing'::text]));
END $$;

-- Insert Philippine Bachelier profile (only if doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE email = 'philippine.bachelier@bienviyance.com') THEN
    INSERT INTO user_profiles (
      id,
      profile_type,
      first_name,
      last_name,
      email,
      photo_url,
      is_active,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      'Marketing',
      'Philippine',
      'Bachelier',
      'philippine.bachelier@bienviyance.com',
      '/Philippine.jpg',
      false,
      now(),
      now()
    );
  END IF;
END $$;

-- Insert some example documents for each category
DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM library_documents WHERE title = 'Guide PER - Présentation complète') THEN
      INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
      VALUES (
        '1',
        'Guide PER - Présentation complète',
        'library-documents/guide-per-presentation.pdf',
        'guide-per-presentation.pdf',
        524288,
        'PER',
        admin_id
      );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM library_documents WHERE title = 'Assurance Vie - Documentation technique') THEN
      INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by)
      VALUES (
        '1',
        'Assurance Vie - Documentation technique',
        'library-documents/assurance-vie-documentation.pdf',
        'assurance-vie-documentation.pdf',
        786432,
        'Assurance Vie',
        admin_id
      );
    END IF;
  END IF;
END $$;
