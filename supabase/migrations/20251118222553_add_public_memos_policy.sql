/*
  # Add Public Access Policy for Memos (Demo Mode)

  1. Purpose
    - Allow public read access to all memos for demonstration purposes
    - Enable the demo to work without authentication
    - Keep other operations (insert, update, delete) restricted to authenticated users

  2. Changes
    - Add a new SELECT policy for anonymous users
    - Allow public read access to all memos in the system

  3. Security
    - Only SELECT operations are made public
    - INSERT, UPDATE, DELETE remain restricted to authenticated users
    - This is suitable for demo/testing environments
*/

-- Drop the restrictive policy first
DROP POLICY IF EXISTS "Users can view own memos" ON memos;

-- Add public read access policy for memos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'memos' 
    AND policyname = 'Public read access for demo'
  ) THEN
    CREATE POLICY "Public read access for demo"
      ON memos
      FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- Allow authenticated users to read all memos (not just their own) for demo
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'memos' 
    AND policyname = 'Authenticated users can view all memos'
  ) THEN
    CREATE POLICY "Authenticated users can view all memos"
      ON memos
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
