/*
  # Création de la table des commentaires pour les leads

  1. Nouvelle table
    - `lead_comments`
      - `id` (uuid, clé primaire)
      - `lead_id` (text, référence au lead)
      - `user_id` (uuid, référence à l'utilisateur)
      - `content` (text, contenu du commentaire)
      - `created_at` (timestamptz, date de création)
      - `updated_at` (timestamptz, date de modification)
  
  2. Sécurité
    - Activer RLS sur la table `lead_comments`
    - Politique pour permettre aux utilisateurs authentifiés de lire les commentaires
    - Politique pour permettre aux utilisateurs authentifiés de créer des commentaires
    - Politique pour permettre aux utilisateurs de modifier leurs propres commentaires
    - Politique pour permettre aux utilisateurs de supprimer leurs propres commentaires
*/

CREATE TABLE IF NOT EXISTS lead_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id text NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lead_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all comments"
  ON lead_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON lead_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON lead_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON lead_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_lead_comments_lead_id ON lead_comments(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_comments_user_id ON lead_comments(user_id);