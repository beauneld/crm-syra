/*
  # Création de la table devoirs_conseil
  
  Table pour stocker les documents de devoir de conseil conformes à la DDA (Directive Distribution Assurance).
  
  1. Nouvelle table
    - `devoirs_conseil`
      - `id` (uuid, primary key)
      - `client_name` (text) - Nom du client
      - `besoins` (text) - Besoins du client
      - `risques` (text) - Risques identifiés
      - `budget` (text) - Budget du client
      - `situation_familiale` (text) - Situation familiale
      - `situation_professionnelle` (text) - Situation professionnelle
      - `projets` (text) - Projets du client
      - `autres_remarques` (text) - Autres remarques
      - `produits_proposes` (text) - Produits proposés
      - `garanties` (text) - Garanties
      - `exclusions` (text) - Exclusions
      - `limites` (text) - Limites
      - `conditions` (text) - Conditions
      - `contrat_choisi` (text) - Contrat choisi
      - `options` (text) - Options
      - `montants_garantie` (text) - Montants de garantie
      - `adequation_confirmee` (boolean) - Confirmation de l'adéquation
      - `risques_refus` (text) - Risques en cas de refus de garanties
      - `signature_client` (text) - Signature du client
      - `date_signature` (date) - Date de signature
      - `user_id` (uuid) - ID de l'utilisateur qui a créé le document
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de mise à jour
  
  2. Sécurité
    - Enable RLS sur la table `devoirs_conseil`
    - Les utilisateurs authentifiés peuvent lire leurs propres documents
    - Les utilisateurs authentifiés peuvent créer des documents
    - Les utilisateurs authentifiés peuvent mettre à jour leurs propres documents
    - Les utilisateurs authentifiés peuvent supprimer leurs propres documents
*/

CREATE TABLE IF NOT EXISTS devoirs_conseil (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  besoins text DEFAULT '',
  risques text DEFAULT '',
  budget text DEFAULT '',
  situation_familiale text DEFAULT '',
  situation_professionnelle text DEFAULT '',
  projets text DEFAULT '',
  autres_remarques text DEFAULT '',
  produits_proposes text DEFAULT '',
  garanties text DEFAULT '',
  exclusions text DEFAULT '',
  limites text DEFAULT '',
  conditions text DEFAULT '',
  contrat_choisi text DEFAULT '',
  options text DEFAULT '',
  montants_garantie text DEFAULT '',
  adequation_confirmee boolean DEFAULT false,
  risques_refus text DEFAULT '',
  signature_client text DEFAULT '',
  date_signature date DEFAULT CURRENT_DATE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE devoirs_conseil ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own devoirs conseil"
  ON devoirs_conseil
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create devoirs conseil"
  ON devoirs_conseil
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devoirs conseil"
  ON devoirs_conseil
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own devoirs conseil"
  ON devoirs_conseil
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_devoirs_conseil_user_id ON devoirs_conseil(user_id);
CREATE INDEX IF NOT EXISTS idx_devoirs_conseil_created_at ON devoirs_conseil(created_at DESC);
