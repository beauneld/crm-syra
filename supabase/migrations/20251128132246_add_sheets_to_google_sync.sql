/*
  # Add Google Sheets support to google_sync table

  1. Changes
    - Add `sheets_connected` column (boolean) - Google Sheets connection status
    - Add `sheets_email` column (text) - Connected Google Sheets email address

  2. Notes
    - This migration extends the existing google_sync table to support Google Sheets synchronization
    - Google Sheets will be available for Admin and Manager profiles only
    - Default values are set for existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'google_sync' AND column_name = 'sheets_connected'
  ) THEN
    ALTER TABLE google_sync ADD COLUMN sheets_connected boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'google_sync' AND column_name = 'sheets_email'
  ) THEN
    ALTER TABLE google_sync ADD COLUMN sheets_email text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_google_sync_sheets_connected ON google_sync(sheets_connected);
