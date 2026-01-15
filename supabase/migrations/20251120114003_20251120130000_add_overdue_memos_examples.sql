/*
  # Ajouter des mémos dépassés pour la démonstration
  
  1. Objectif
    - Ajouter quelques mémos avec des dates passées pour tester l'indicateur "DÉPASSÉ"
    - Conserver les mémos futurs existants
    
  2. Nouveaux mémos dépassés (3 exemples)
    - Rappel urgent – Dossier BERNARD (19/11/2025 10:00)
    - Validation contrat – LAMBERT (18/11/2025 14:30)
    - Suivi client – ROUSSEAU (19/11/2025 16:00)
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the first admin user
  SELECT id INTO admin_id FROM user_profiles WHERE profile_type = 'Admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Add overdue memos without deleting existing ones
    INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status)
    VALUES
      ('1', admin_id, 'Rappel urgent – Dossier BERNARD', 'Contacter le client pour les pièces manquantes.', '2025-11-19', '10:00:00', 'pending'),
      ('1', admin_id, 'Validation contrat – LAMBERT', 'Vérifier et valider le dossier en attente.', '2025-11-18', '14:30:00', 'pending'),
      ('1', admin_id, 'Suivi client – ROUSSEAU', 'Faire un point sur l''avancement du dossier.', '2025-11-19', '16:00:00', 'pending')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;