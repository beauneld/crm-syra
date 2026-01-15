/*
  # Create predefined messages table

  1. New Tables
    - `predefined_messages`
      - `id` (uuid, primary key) - Unique identifier for the message
      - `title` (text) - Short title/name for the message
      - `content` (text) - Full content of the message
      - `category` (text) - Category for organizing messages (description, justification, recommendation)
      - `user_id` (uuid) - ID of the user who created the message
      - `is_active` (boolean) - Whether the message is active
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `predefined_messages` table
    - Policy for authenticated users to read their own messages
    - Policy for authenticated users to create messages
    - Policy for authenticated users to update their own messages
    - Policy for authenticated users to delete their own messages

  3. Indexes
    - Index on user_id for efficient querying
    - Index on category for filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS predefined_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'description',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE predefined_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predefined messages"
  ON predefined_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create predefined messages"
  ON predefined_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predefined messages"
  ON predefined_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own predefined messages"
  ON predefined_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_predefined_messages_user_id ON predefined_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_predefined_messages_category ON predefined_messages(category);
CREATE INDEX IF NOT EXISTS idx_predefined_messages_created_at ON predefined_messages(created_at DESC);
