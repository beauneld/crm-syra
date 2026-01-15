/*
  # Mise à jour des politiques RLS pour devoirs_conseil
  
  Rend les devoirs de conseil visibles à tous les utilisateurs authentifiés.
  
  1. Modifications
    - Supprime la politique restrictive de lecture
    - Crée une nouvelle politique permettant à tous les utilisateurs authentifiés de voir tous les devoirs de conseil
  
  2. Sécurité
    - Les utilisateurs authentifiés peuvent voir TOUS les devoirs de conseil
    - Les utilisateurs peuvent toujours créer des devoirs avec leur propre user_id
    - Les utilisateurs peuvent toujours modifier/supprimer uniquement leurs propres devoirs
*/

DROP POLICY IF EXISTS "Users can view own devoirs conseil" ON devoirs_conseil;

CREATE POLICY "Authenticated users can view all devoirs conseil"
  ON devoirs_conseil
  FOR SELECT
  TO authenticated
  USING (true);
