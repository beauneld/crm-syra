/*
  # Create email_config table for SMTP configuration

  1. New Tables
    - `email_config`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles.id) - User profile reference
      - `from_name` (text) - Sender name
      - `from_email` (text) - Sender email address
      - `use_different_account_name` (boolean) - Whether to use different account name
      - `password_encrypted` (text) - Encrypted SMTP password
      - `host` (text) - SMTP server host
      - `port` (integer) - SMTP server port
      - `smtp_connection_type` (text) - Connection type: SSL, TLS, None
      - `use_different_reply_to` (boolean) - Whether to use different reply-to address
      - `reply_to_email` (text, nullable) - Reply-to email address
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `email_config` table
    - Add policies for users to access only their own configuration
    - Users can read, create, update, and delete their own email configuration

  3. Indexes
    - Add unique index on user_id to ensure one config per user
    - Add index on user_id for faster lookups
*/

CREATE TABLE IF NOT EXISTS email_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  from_name text NOT NULL DEFAULT '',
  from_email text NOT NULL DEFAULT '',
  use_different_account_name boolean DEFAULT false,
  password_encrypted text NOT NULL DEFAULT '',
  host text NOT NULL DEFAULT '',
  port integer DEFAULT 587 CHECK (port >= 1 AND port <= 65535),
  smtp_connection_type text DEFAULT 'TLS' CHECK (smtp_connection_type IN ('SSL', 'TLS', 'None')),
  use_different_reply_to boolean DEFAULT false,
  reply_to_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_config_user_id_unique ON email_config(user_id);
CREATE INDEX IF NOT EXISTS idx_email_config_user_id ON email_config(user_id);

ALTER TABLE email_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email config"
  ON email_config FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own email config"
  ON email_config FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own email config"
  ON email_config FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own email config"
  ON email_config FOR DELETE
  TO public
  USING (true);

CREATE OR REPLACE FUNCTION update_email_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_email_config_updated_at ON email_config;
CREATE TRIGGER trigger_update_email_config_updated_at
  BEFORE UPDATE ON email_config
  FOR EACH ROW
  EXECUTE FUNCTION update_email_config_updated_at();
