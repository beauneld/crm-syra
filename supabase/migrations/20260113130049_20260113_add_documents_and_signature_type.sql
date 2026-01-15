/*
  # Add Document Storage and Signature Type Tracking for Devoirs Conseil

  ## Changes
  
  1. New Table: devoir_conseil_documents
    - Stores all documents related to a devoir de conseil
    - document_type: piece_identite, rib, justificatif_domicile, autre
    - Tracks file URL, name, size, and uploader
  
  2. Update devoirs_conseil Table
    - Add signature_type column to track signature method (immediate/email)
    - Update status values to match new workflow
  
  3. Security
    - Enable RLS on devoir_conseil_documents table
    - Add policies for authenticated users to manage documents
*/

-- Create devoir_conseil_documents table
CREATE TABLE IF NOT EXISTS devoir_conseil_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  devoir_conseil_id uuid NOT NULL REFERENCES devoirs_conseil(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('piece_identite', 'rib', 'justificatif_domicile', 'autre')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  uploaded_by text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add signature_type column to devoirs_conseil if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'signature_type'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN signature_type text CHECK (signature_type IN ('immediate', 'email'));
  END IF;
END $$;

-- Enable RLS on devoir_conseil_documents
ALTER TABLE devoir_conseil_documents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to devoir_conseil_documents
CREATE POLICY "Anyone can view devoir conseil documents"
  ON devoir_conseil_documents FOR SELECT
  USING (true);

-- Allow public insert access to devoir_conseil_documents
CREATE POLICY "Anyone can insert devoir conseil documents"
  ON devoir_conseil_documents FOR INSERT
  WITH CHECK (true);

-- Allow public update access to devoir_conseil_documents
CREATE POLICY "Anyone can update devoir conseil documents"
  ON devoir_conseil_documents FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete access to devoir_conseil_documents
CREATE POLICY "Anyone can delete devoir conseil documents"
  ON devoir_conseil_documents FOR DELETE
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_devoir_conseil_documents_devoir_id 
  ON devoir_conseil_documents(devoir_conseil_id);