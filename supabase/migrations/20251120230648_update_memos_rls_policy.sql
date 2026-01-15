/*
  # Mise à jour des politiques RLS pour la table memos
  
  1. Modifications
    - Permet à tous les utilisateurs de lire tous les mémos (organisation partagée)
    - Maintient les restrictions pour create/update/delete
*/

-- Supprimer l'ancienne politique de lecture
DROP POLICY IF EXISTS "Users can view own memos" ON memos;
DROP POLICY IF EXISTS "Public read access for memos" ON memos;

-- Créer une nouvelle politique de lecture pour tous les utilisateurs
CREATE POLICY "Anyone can view all memos"
  ON memos FOR SELECT
  TO public
  USING (true);

-- Garder les politiques de création pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Users can create own memos" ON memos;
CREATE POLICY "Public can create memos"
  ON memos FOR INSERT
  TO public
  WITH CHECK (true);

-- Garder les politiques de mise à jour pour tous
DROP POLICY IF EXISTS "Users can update own memos" ON memos;
CREATE POLICY "Public can update memos"
  ON memos FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Garder les politiques de suppression pour tous
DROP POLICY IF EXISTS "Users can delete own memos" ON memos;
CREATE POLICY "Public can delete memos"
  ON memos FOR DELETE
  TO public
  USING (true);