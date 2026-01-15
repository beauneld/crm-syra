/*
  # Create user activity tracking tables

  1. New Tables
    - `user_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `session_start` (timestamptz) - When the user logged in
      - `session_end` (timestamptz, nullable) - When the user logged out
      - `duration_seconds` (integer, nullable) - Total session duration in seconds
      - `ip_address` (text, nullable) - User's IP address
      - `user_agent` (text, nullable) - Browser/device information
      - `created_at` (timestamptz)
      
    - `user_activity_daily`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `activity_date` (date) - The date for this activity record
      - `total_duration_seconds` (integer) - Total time spent on the CRM that day
      - `session_count` (integer) - Number of sessions that day
      - `first_login` (timestamptz) - First login time of the day
      - `last_logout` (timestamptz, nullable) - Last logout time of the day
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (can be restricted later)
    - Add policies for insert/update operations

  3. Indexes
    - Add index on user_id for both tables
    - Add index on activity_date for daily activity table
    - Add composite index on (user_id, activity_date) for optimized queries
*/

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_start timestamptz NOT NULL DEFAULT now(),
  session_end timestamptz,
  duration_seconds integer,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create user_activity_daily table
CREATE TABLE IF NOT EXISTS user_activity_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_date date NOT NULL,
  total_duration_seconds integer DEFAULT 0,
  session_count integer DEFAULT 0,
  first_login timestamptz,
  last_logout timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Create indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_start ON user_sessions(session_start);

-- Create indexes for user_activity_daily
CREATE INDEX IF NOT EXISTS idx_user_activity_daily_user_id ON user_activity_daily(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_daily_activity_date ON user_activity_daily(activity_date);
CREATE INDEX IF NOT EXISTS idx_user_activity_daily_user_date ON user_activity_daily(user_id, activity_date);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_daily ENABLE ROW LEVEL SECURITY;

-- Policies for user_sessions
CREATE POLICY "Public read access for user_sessions"
  ON user_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public insert access for user_sessions"
  ON user_sessions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public update access for user_sessions"
  ON user_sessions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policies for user_activity_daily
CREATE POLICY "Public read access for user_activity_daily"
  ON user_activity_daily FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public insert access for user_activity_daily"
  ON user_activity_daily FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public update access for user_activity_daily"
  ON user_activity_daily FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_activity_daily_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_user_activity_daily_updated_at ON user_activity_daily;
CREATE TRIGGER trigger_update_user_activity_daily_updated_at
  BEFORE UPDATE ON user_activity_daily
  FOR EACH ROW
  EXECUTE FUNCTION update_user_activity_daily_updated_at();
