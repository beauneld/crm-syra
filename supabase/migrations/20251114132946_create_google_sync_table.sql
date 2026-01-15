/*
  # Create google_sync table for Google Calendar and Gmail synchronization

  1. New Tables
    - `google_sync`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `gmail_connected` (boolean) - Gmail connection status
      - `calendar_connected` (boolean) - Google Calendar connection status
      - `gmail_email` (text) - Connected Gmail email address
      - `access_token_encrypted` (text) - Encrypted OAuth2 access token
      - `refresh_token_encrypted` (text) - Encrypted OAuth2 refresh token
      - `token_expires_at` (timestamptz) - Token expiration timestamp
      - `last_sync_at` (timestamptz) - Last successful sync timestamp
      - `sync_status` (text) - Status: 'connected', 'error', 'disconnected'
      - `sync_error_message` (text) - Error message if sync fails
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `google_sync` table
    - Add policy for public access (temporary for development)

  3. Indexes
    - Add index on user_id for faster lookups
    - Add index on sync_status for filtering
*/

-- Create google_sync table
CREATE TABLE IF NOT EXISTS google_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  gmail_connected boolean DEFAULT false,
  calendar_connected boolean DEFAULT false,
  gmail_email text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  last_sync_at timestamptz,
  sync_status text DEFAULT 'disconnected' CHECK (sync_status IN ('connected', 'error', 'disconnected')),
  sync_error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_google_sync_user_id ON google_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_google_sync_status ON google_sync(sync_status);

-- Enable RLS
ALTER TABLE google_sync ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access (temporary for development)
CREATE POLICY "Public read access for google_sync"
  ON google_sync FOR SELECT
  TO public
  USING (true);

-- Policy: Public write access (temporary for development)
CREATE POLICY "Public write access for google_sync"
  ON google_sync FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public update access for google_sync"
  ON google_sync FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public delete access for google_sync"
  ON google_sync FOR DELETE
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_google_sync_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_google_sync_updated_at ON google_sync;
CREATE TRIGGER trigger_update_google_sync_updated_at
  BEFORE UPDATE ON google_sync
  FOR EACH ROW
  EXECUTE FUNCTION update_google_sync_updated_at();
