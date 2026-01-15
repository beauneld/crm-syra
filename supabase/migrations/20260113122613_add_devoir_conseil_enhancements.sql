/*
  # Enhancements to Devoir de Conseil Module
  
  ## Updates
  
  1. **devoirs_conseil table modifications**
    - Add `status` column with values: 'Non signé', 'Signé', 'Envoyé en AF'
    - Add client detail columns (civilité, nom, prenom, etc.)
    - Remove `contrat_choisi` column (will be replaced by separate contracts table)
  
  2. **New table: devoir_conseil_contrats**
    - Manage multiple contracts per devoir de conseil
    - Links to devoirs_conseil via foreign key
    - Stores contract details: type, garanties, montants, etc.
  
  3. **Security**
    - Enable RLS on new table
    - Add public access policies for demo purposes
  
  ## Notes
  - Existing data will be preserved
  - Status defaults to 'Non signé' for existing records
  - Supports multiple contracts per conseil
*/

-- Add new columns to devoirs_conseil table
DO $$
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'status'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN status text DEFAULT 'Non signé' CHECK (status IN ('Non signé', 'Signé', 'Envoyé en AF'));
  END IF;

  -- Add civilite column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'civilite'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN civilite text DEFAULT '';
  END IF;

  -- Add nom column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'nom'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN nom text DEFAULT '';
  END IF;

  -- Add prenom column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'prenom'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN prenom text DEFAULT '';
  END IF;

  -- Add telephone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'telephone'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN telephone text DEFAULT '';
  END IF;

  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'email'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN email text DEFAULT '';
  END IF;

  -- Add adresse column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'adresse'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN adresse text DEFAULT '';
  END IF;

  -- Add ville column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'ville'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN ville text DEFAULT '';
  END IF;

  -- Add code_postal column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'code_postal'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN code_postal text DEFAULT '';
  END IF;

  -- Add date_naissance column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'date_naissance'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN date_naissance date;
  END IF;

  -- Add statut_professionnel column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'statut_professionnel'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN statut_professionnel text DEFAULT '';
  END IF;

  -- Add profession column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'profession'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN profession text DEFAULT '';
  END IF;

  -- Add signataire_id column if it doesn't exist (to track who is the advisor/signataire)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devoirs_conseil' AND column_name = 'signataire_id'
  ) THEN
    ALTER TABLE devoirs_conseil ADD COLUMN signataire_id uuid REFERENCES user_profiles(id);
  END IF;
END $$;

-- Create devoir_conseil_contrats table for managing multiple contracts
CREATE TABLE IF NOT EXISTS devoir_conseil_contrats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  devoir_conseil_id uuid NOT NULL REFERENCES devoirs_conseil(id) ON DELETE CASCADE,
  contrat_type text NOT NULL,
  contrat_nom text NOT NULL,
  garanties text DEFAULT '',
  exclusions text DEFAULT '',
  limites text DEFAULT '',
  conditions text DEFAULT '',
  options text DEFAULT '',
  montants_garantie text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE devoir_conseil_contrats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to devoir_conseil_contrats"
  ON devoir_conseil_contrats FOR ALL
  USING (true)
  WITH CHECK (true);