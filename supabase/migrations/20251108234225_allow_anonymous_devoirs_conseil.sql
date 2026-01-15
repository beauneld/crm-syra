/*
  # Autoriser l'accès anonyme aux devoirs de conseil pour le développement

  1. Modifications
    - Permettre aux utilisateurs anonymes de lire tous les devoirs de conseil
    - Permettre aux utilisateurs anonymes de créer des devoirs de conseil
    - Permettre aux utilisateurs anonymes de modifier tous les devoirs de conseil
    - Permettre aux utilisateurs anonymes de supprimer tous les devoirs de conseil

  2. Sécurité
    - Ces politiques sont pour le développement uniquement
    - En production, ces politiques devraient être restreintes aux utilisateurs authentifiés
*/

-- Politique de lecture pour tous (authentifiés et anonymes)
DROP POLICY IF EXISTS "Authenticated users can view all devoirs conseil" ON devoirs_conseil;

CREATE POLICY "Anyone can view devoirs conseil"
  ON devoirs_conseil
  FOR SELECT
  USING (true);

-- Politique d'insertion pour tous
DROP POLICY IF EXISTS "Users can create devoirs conseil" ON devoirs_conseil;

CREATE POLICY "Anyone can create devoirs conseil"
  ON devoirs_conseil
  FOR INSERT
  WITH CHECK (true);

-- Politique de mise à jour pour tous
DROP POLICY IF EXISTS "Users can update own devoirs conseil" ON devoirs_conseil;

CREATE POLICY "Anyone can update devoirs conseil"
  ON devoirs_conseil
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Politique de suppression pour tous
DROP POLICY IF EXISTS "Users can delete own devoirs conseil" ON devoirs_conseil;

CREATE POLICY "Anyone can delete devoirs conseil"
  ON devoirs_conseil
  FOR DELETE
  USING (true);
