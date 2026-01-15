/*
  # Add Signature Management and Documents to Devoir de Conseil
  
  This migration:
  1. Adds new signature-related columns to devoirs_conseil table
  2. Creates devoir_conseil_documents table for managing uploaded documents
  3. Creates devoir_conseil_contrats table for contract details
  4. Enables RLS and sets up public access policies
  
  ## New Columns in devoirs_conseil
  - signature_status: Status of the signature (Non signé, Signature par email, Signature physique, Envoyé en AF)
  - signature_type: Type of signature (immediate or email)
  - signature_document_url: URL to the uploaded signature document
  - affaires_nouvelles_status: Status of sending to affaires nouvelles
  - affaires_nouvelles_sent_at: Timestamp when sent to affaires nouvelles
  - apporteur_affaires: Business provider information
  - commentaires_internes: Internal comments
  
  ## New Tables
  - devoir_conseil_documents: Stores uploaded documents (ID, RIB, proof of residence, etc.)
  - devoir_conseil_contrats: Stores contract details linked to devoir de conseil
  
  ## Security
  - RLS enabled on all tables
  - Public access policies for demo purposes
*/

-- Add new columns to devoirs_conseil table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devoirs_conseil' AND column_name = 'signature_status') THEN
    ALTER TABLE devoirs_conseil ADD COLUMN signature_status text DEFAULT 'Non signé' CHECK (signature_status IN ('Non signé', 'Signature par email', 'Signature physique', 'Envoyé en AF'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devoirs_conseil' AND column_name = 'signature_type') THEN
    ALTER TABLE devoirs_conseil ADD COLUMN signature_type text CHECK (signature_type IN ('immediate', 'email'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devoirs_conseil' AND column_name = 'signature_document_url') THEN
    ALTER TABLE devoirs_conseil ADD COLUMN signature_document_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devoirs_conseil' AND column_name = 'affaires_nouvelles_status') THEN
    ALTER TABLE devoirs_conseil ADD COLUMN affaires_nouvelles_status text DEFAULT 'pending' CHECK (affaires_nouvelles_status IN ('pending', 'sent'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devoirs_conseil' AND column_name = 'affaires_nouvelles_sent_at') THEN
    ALTER TABLE devoirs_conseil ADD COLUMN affaires_nouvelles_sent_at timestamptz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devoirs_conseil' AND column_name = 'apporteur_affaires') THEN
    ALTER TABLE devoirs_conseil ADD COLUMN apporteur_affaires text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devoirs_conseil' AND column_name = 'commentaires_internes') THEN
    ALTER TABLE devoirs_conseil ADD COLUMN commentaires_internes text DEFAULT '';
  END IF;
END $$;

-- Create devoir_conseil_documents table
CREATE TABLE IF NOT EXISTS devoir_conseil_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  devoir_conseil_id uuid REFERENCES devoirs_conseil(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('piece_identite', 'rib', 'justificatif_domicile', 'autres')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  uploaded_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE devoir_conseil_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to devoir_conseil_documents"
  ON devoir_conseil_documents FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_devoir_conseil_documents_devoir ON devoir_conseil_documents(devoir_conseil_id);
CREATE INDEX IF NOT EXISTS idx_devoir_conseil_documents_type ON devoir_conseil_documents(document_type);

-- Create devoir_conseil_contrats table
CREATE TABLE IF NOT EXISTS devoir_conseil_contrats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  devoir_conseil_id uuid REFERENCES devoirs_conseil(id) ON DELETE CASCADE,
  assureur text NOT NULL,
  produit text,
  gamme_contrat text,
  descriptions text,
  justifications text,
  garanties text,
  exclusions text,
  limites text,
  conditions text,
  options text,
  montants text,
  montant_cotisation text,
  periodicite text,
  frais_entree text,
  frais_gestion text,
  frais_uc text,
  montant_transfert text,
  numero_contrat text,
  date_effet date,
  date_souscription date,
  loi_madelin boolean DEFAULT false,
  mma_elite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE devoir_conseil_contrats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to devoir_conseil_contrats"
  ON devoir_conseil_contrats FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_devoir_conseil_contrats_devoir ON devoir_conseil_contrats(devoir_conseil_id);
CREATE INDEX IF NOT EXISTS idx_devoir_conseil_contrats_assureur ON devoir_conseil_contrats(assureur);
