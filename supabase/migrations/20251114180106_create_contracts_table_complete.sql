/*
  # Create Complete Contracts Table with Product-Specific Fields

  1. New Tables
    - `contracts`
      - Basic contract information (id, organization_id, lead_id, client_name, etc.)
      - Original contract fields (assureur, gamme_contrat, en_portefeuille, etc.)
      - Product-specific dynamic fields (produit, remuneration_type, versement_initial, etc.)
      - Date fields (date_souscription, date_effet, date_echeance, date_effet_supplementaire)
      - Financial fields (montant_initial, versement_programme, periodicite, etc.)
      - Transfer fields (transfert, montant_transfert, frais_transfert)
      - Status and tracking fields (status, validation_date, error_type, etc.)

  2. Security
    - Enable RLS on `contracts` table
    - Add policies for authenticated users to manage contracts

  3. Important Notes
    - Product-specific fields support dynamic form rendering
    - All optional fields are nullable for maximum flexibility
    - Supports both legacy contract data and new product-specific data
*/

CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL,
  lead_id uuid,
  devoir_conseil_id uuid,
  client_name text NOT NULL,
  contract_type text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  validation_date timestamptz,
  error_type text,
  is_reprise boolean DEFAULT false,
  reprise_success boolean,
  
  assureur text,
  gamme_contrat text,
  produit text,
  remuneration_type text,
  en_portefeuille boolean DEFAULT false,
  loi_madelin boolean DEFAULT false,
  contrat_principal boolean DEFAULT false,
  numero_contrat text,
  delegataire_gestion text,
  attentes text,
  commentaires text,
  
  date_souscription date,
  date_effet date,
  date_echeance date,
  date_effet_supplementaire date,
  
  montant_initial numeric,
  versement_programme numeric,
  versement_initial numeric,
  periodicite text,
  
  vl text,
  frais_versement text,
  vp_optionnel text,
  frais_a_definir text,
  frais_chacun text,
  frais_dossier text,
  mma_elite boolean DEFAULT false,
  
  transfert boolean DEFAULT false,
  montant_transfert text,
  frais_transfert text,
  
  propositions_comparatives text[],
  assureurs_interroges text[],
  
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
CREATE INDEX IF NOT EXISTS idx_contracts_devoir_conseil_id ON contracts(devoir_conseil_id);
CREATE INDEX IF NOT EXISTS idx_contracts_produit ON contracts(produit);
CREATE INDEX IF NOT EXISTS idx_contracts_assureur ON contracts(assureur);
CREATE INDEX IF NOT EXISTS idx_contracts_gamme_contrat ON contracts(gamme_contrat);
