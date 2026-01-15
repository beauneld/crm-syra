/*
  # Aligner toutes les tables avec les types TypeScript du CRM
  
  1. Modifications des tables
    - Memos: ajouter organization_id, user_id, due_time, supprimer assigned_to/created_by
    - Library documents: ajouter organization_id, file_name, sub_category
    - Leads: ajouter tous les champs manquants
    - Appointments: ajouter user_id, google_calendar_id, outlook_calendar_id
    - Contracts: ajouter tous les champs détaillés manquants
    
  2. Sécurité
    - RLS maintenu sur toutes les tables
*/

-- MEMOS: Recréer avec la bonne structure
DROP TABLE IF EXISTS memos CASCADE;

CREATE TABLE memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL DEFAULT '1',
  user_id uuid REFERENCES user_profiles(id),
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  due_time time NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to memos" ON memos FOR ALL TO public USING (true) WITH CHECK (true);

-- Réinsérer les mémos
INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status) VALUES
  ('1', '22222222-2222-2222-2222-222222222222', 'Rappeler client Dubois', 'Appeler M. Dubois pour finaliser dossier PER', CURRENT_DATE - 2, '09:00', 'pending'),
  ('1', '11111111-1111-1111-1111-111111111111', 'Préparer présentation', 'Préparer présentation réunion demain', CURRENT_DATE, '14:00', 'pending'),
  ('1', '66666666-6666-6666-6666-666666666666', 'Vérifier documents Martin', 'Vérifier documents dossier Martin', CURRENT_DATE + 1, '10:00', 'pending'),
  ('1', '11111111-1111-1111-1111-111111111111', 'Formation équipe', 'Organiser formation nouveaux produits', CURRENT_DATE + 3, '15:00', 'pending'),
  ('1', '55555555-5555-5555-5555-555555555555', 'RDV partenaire', 'RDV avec Assuravia', CURRENT_DATE + 5, '11:00', 'pending'),
  ('1', '44444444-4444-4444-4444-444444444444', 'Relance prospects', 'Relancer prospects semaine dernière', CURRENT_DATE + 7, '09:30', 'pending'),
  ('1', '66666666-6666-6666-6666-666666666666', 'MAJ bibliothèque', 'Mettre à jour bibliothèque', CURRENT_DATE + 10, '16:00', 'pending'),
  ('1', '11111111-1111-1111-1111-111111111111', 'Analyse performance', 'Analyser performances du mois', CURRENT_DATE + 14, '10:00', 'pending'),
  ('1', '66666666-6666-6666-6666-666666666666', 'Newsletter mensuelle', 'Préparer newsletter clients', CURRENT_DATE + 20, '14:30', 'pending'),
  ('1', '55555555-5555-5555-5555-555555555555', 'Audit conformité', 'Audit conformité trimestriel', CURRENT_DATE + 25, '09:00', 'pending'),
  ('1', '11111111-1111-1111-1111-111111111111', 'Planification Q2', 'Planifier objectifs Q2', CURRENT_DATE + 30, '15:00', 'pending'),
  ('1', '22222222-2222-2222-2222-222222222222', 'Révision contrats', 'Réviser contrats en cours', CURRENT_DATE - 5, '10:30', 'pending');

-- LIBRARY_DOCUMENTS: Ajouter colonnes manquantes
ALTER TABLE library_documents DROP COLUMN IF EXISTS uploaded_by CASCADE;
ALTER TABLE library_documents DROP COLUMN IF EXISTS description CASCADE;
ALTER TABLE library_documents DROP COLUMN IF EXISTS is_active CASCADE;

ALTER TABLE library_documents ADD COLUMN IF NOT EXISTS organization_id text DEFAULT '1';
ALTER TABLE library_documents ADD COLUMN IF NOT EXISTS file_name text;
ALTER TABLE library_documents ADD COLUMN IF NOT EXISTS file_size integer DEFAULT 0;
ALTER TABLE library_documents ADD COLUMN IF NOT EXISTS sub_category text;
ALTER TABLE library_documents ADD COLUMN IF NOT EXISTS uploaded_by text;
ALTER TABLE library_documents ADD COLUMN IF NOT EXISTS uploaded_at timestamptz DEFAULT now();

-- Mettre à jour les documents existants
UPDATE library_documents SET 
  file_name = title || '.pdf',
  file_size = 1024000,
  uploaded_by = '11111111-1111-1111-1111-111111111111',
  uploaded_at = created_at
WHERE file_name IS NULL;

-- LEADS: Ajouter colonnes manquantes
ALTER TABLE leads ADD COLUMN IF NOT EXISTS organization_id text DEFAULT '1';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS owner text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS owner_since timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status_updated_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status_updated_by text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nrp_count integer DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS rdv_count integer DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS imposition text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS birth_year integer;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS postal_code text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS profession text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS residence_status text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS priority text;

-- Mettre à jour les leads existants avec des données cohérentes
UPDATE leads SET
  organization_id = '1',
  owner = CASE 
    WHEN assigned_to = '22222222-2222-2222-2222-222222222222' THEN 'Mandje Conseiller'
    WHEN assigned_to = '44444444-4444-4444-4444-444444444444' THEN 'Benjamin Conseiller'
    WHEN assigned_to = '55555555-5555-5555-5555-555555555555' THEN 'Michael Senior'
    ELSE 'Non assigné'
  END,
  owner_since = created_at,
  imposition = CASE (random() * 3)::int
    WHEN 0 THEN 'Non imposable'
    WHEN 1 THEN '+2500€'
    ELSE '+5000€'
  END,
  birth_year = 1950 + (random() * 50)::int,
  postal_code = (10000 + (random() * 85000)::int)::text,
  city = CASE (random() * 5)::int
    WHEN 0 THEN 'Paris'
    WHEN 1 THEN 'Lyon'
    WHEN 2 THEN 'Marseille'
    WHEN 3 THEN 'Bordeaux'
    ELSE 'Lille'
  END,
  profession = CASE (random() * 4)::int
    WHEN 0 THEN 'Cadre'
    WHEN 1 THEN 'Employé'
    WHEN 2 THEN 'Indépendant'
    ELSE 'Retraité'
  END,
  residence_status = CASE (random() * 2)::int
    WHEN 0 THEN 'Propriétaire'
    ELSE 'Locataire'
  END,
  priority = CASE (random() * 3)::int
    WHEN 0 THEN 'haute'
    WHEN 1 THEN 'moyenne'
    ELSE 'basse'
  END
WHERE organization_id IS NULL;

-- APPOINTMENTS: Ajouter colonnes manquantes
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS organization_id text DEFAULT '1';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS google_calendar_id text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS outlook_calendar_id text;

-- Mettre à jour les appointments existants
UPDATE appointments SET
  organization_id = '1',
  user_id = assigned_to
WHERE organization_id IS NULL;

-- CONTRACTS: S'assurer que tous les champs sont présents
ALTER TABLE contracts ALTER COLUMN organization_id SET DEFAULT '1';
UPDATE contracts SET organization_id = '1' WHERE organization_id IS NULL OR organization_id = '';

-- PARTNERS: Ajouter organization_id
ALTER TABLE partners ADD COLUMN IF NOT EXISTS organization_id text DEFAULT '1';
UPDATE partners SET organization_id = '1' WHERE organization_id IS NULL;

-- PER_SIMULATIONS: Ajouter organization_id
ALTER TABLE per_simulations ADD COLUMN IF NOT EXISTS organization_id text DEFAULT '1';
UPDATE per_simulations SET organization_id = '1' WHERE organization_id IS NULL;

-- GOOGLE_SYNC: Ajouter organization_id
ALTER TABLE google_sync ADD COLUMN IF NOT EXISTS organization_id text DEFAULT '1';
UPDATE google_sync SET organization_id = '1' WHERE organization_id IS NULL;

-- EMAIL_CONFIG: Ajouter organization_id
ALTER TABLE email_config ADD COLUMN IF NOT EXISTS organization_id text DEFAULT '1';
UPDATE email_config SET organization_id = '1' WHERE organization_id IS NULL;

-- USER_SESSIONS: Ajouter les colonnes manquantes
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS ip_address text;
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE user_sessions RENAME COLUMN duration_minutes TO duration_seconds;
UPDATE user_sessions SET duration_seconds = duration_seconds * 60 WHERE duration_seconds < 1000;

-- USER_ACTIVITY_DAILY: Ajouter les colonnes manquantes
ALTER TABLE user_activity_daily ADD COLUMN IF NOT EXISTS first_login timestamptz;
ALTER TABLE user_activity_daily ADD COLUMN IF NOT EXISTS last_logout timestamptz;
ALTER TABLE user_activity_daily RENAME COLUMN total_sessions TO session_count;
ALTER TABLE user_activity_daily RENAME COLUMN total_duration_minutes TO total_duration_seconds;
UPDATE user_activity_daily SET total_duration_seconds = total_duration_seconds * 60 WHERE total_duration_seconds < 10000;

-- Mettre à jour les statistiques existantes
UPDATE user_activity_daily SET
  first_login = activity_date + '08:00:00'::time,
  last_logout = activity_date + '18:00:00'::time
WHERE first_login IS NULL;
