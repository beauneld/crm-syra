/*
  # Create Contracts Table

  1. New Tables
    - `contracts`
      - `id` (uuid, primary key)
      - `organization_id` (text, not null)
      - `lead_id` (uuid, references leads table)
      - `client_name` (text, not null)
      - `contract_type` (text, not null)
      - `amount` (numeric, not null)
      - `status` (text, not null) - values: 'pending', 'validated', 'rejected', 'in_review'
      - `validation_date` (timestamptz)
      - `error_type` (text) - values: 'missing_document', 'invalid_iban', 'invalid_proof', 'signature_missing', null
      - `is_reprise` (boolean, default false)
      - `reprise_success` (boolean)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `contracts` table
    - Add policy for authenticated users to read contracts
    - Add policy for authenticated users to create contracts
    - Add policy for authenticated users to update contracts
    - Add policy for authenticated users to delete contracts
*/

CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  lead_id uuid,
  client_name text NOT NULL,
  contract_type text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  validation_date timestamptz,
  error_type text,
  is_reprise boolean DEFAULT false,
  reprise_success boolean,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'validated', 'rejected', 'in_review')),
  CONSTRAINT valid_error_type CHECK (error_type IS NULL OR error_type IN ('missing_document', 'invalid_iban', 'invalid_proof', 'signature_missing', 'other'))
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create contracts"
  ON contracts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update contracts"
  ON contracts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete contracts"
  ON contracts FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_contracts_organization_id ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_validation_date ON contracts(validation_date);
CREATE INDEX IF NOT EXISTS idx_contracts_lead_id ON contracts(lead_id);