/*
  # Add Contract Details Columns for Devoir de Conseil

  1. Modifications
    - Add columns to `contracts` table for detailed contract information:
      - `assureur` (text) - Insurance company name
      - `gamme_contrat` (text) - Contract range/type (Assurance vie, PER, etc.)
      - `en_portefeuille` (boolean) - In portfolio flag
      - `loi_madelin` (boolean) - Madelin law flag
      - `contrat_principal` (boolean) - Main contract flag
      - `numero_contrat` (text) - Contract number
      - `delegataire_gestion` (text) - Management delegate
      - `attentes` (text) - Expectations
      - `commentaires` (text) - Comments
      - `date_souscription` (date) - Subscription date
      - `date_effet` (date) - Effect date
      - `date_echeance` (date) - Expiry date
      - `montant_initial` (numeric) - Initial amount
      - `versement_programme` (numeric) - Scheduled payment
      - `periodicite` (text) - Frequency (Mensuel, Trimestriel, etc.)
      - `devoir_conseil_id` (uuid) - Link to devoir de conseil

  2. Important Notes
    - Existing columns remain unchanged
    - New columns are nullable to maintain compatibility with existing data
    - No data loss occurs
*/

-- Add new columns for detailed contract information
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'assureur'
  ) THEN
    ALTER TABLE contracts ADD COLUMN assureur text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'gamme_contrat'
  ) THEN
    ALTER TABLE contracts ADD COLUMN gamme_contrat text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'en_portefeuille'
  ) THEN
    ALTER TABLE contracts ADD COLUMN en_portefeuille boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'loi_madelin'
  ) THEN
    ALTER TABLE contracts ADD COLUMN loi_madelin boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'contrat_principal'
  ) THEN
    ALTER TABLE contracts ADD COLUMN contrat_principal boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'numero_contrat'
  ) THEN
    ALTER TABLE contracts ADD COLUMN numero_contrat text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'delegataire_gestion'
  ) THEN
    ALTER TABLE contracts ADD COLUMN delegataire_gestion text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'attentes'
  ) THEN
    ALTER TABLE contracts ADD COLUMN attentes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'commentaires'
  ) THEN
    ALTER TABLE contracts ADD COLUMN commentaires text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'date_souscription'
  ) THEN
    ALTER TABLE contracts ADD COLUMN date_souscription date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'date_effet'
  ) THEN
    ALTER TABLE contracts ADD COLUMN date_effet date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'date_echeance'
  ) THEN
    ALTER TABLE contracts ADD COLUMN date_echeance date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'montant_initial'
  ) THEN
    ALTER TABLE contracts ADD COLUMN montant_initial numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'versement_programme'
  ) THEN
    ALTER TABLE contracts ADD COLUMN versement_programme numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'periodicite'
  ) THEN
    ALTER TABLE contracts ADD COLUMN periodicite text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'devoir_conseil_id'
  ) THEN
    ALTER TABLE contracts ADD COLUMN devoir_conseil_id uuid;
  END IF;
END $$;

-- Add index for devoir_conseil_id for better query performance
CREATE INDEX IF NOT EXISTS idx_contracts_devoir_conseil_id ON contracts(devoir_conseil_id);
