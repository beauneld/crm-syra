/*
  # Corriger la structure de user_profiles pour correspondre au CRM
  
  1. Modifications
    - Supprimer et recréer user_profiles avec la bonne structure
    - profile_type au lieu de role
    - first_name et last_name au lieu de full_name
    - photo_url au lieu de photo
    - Ajouter team_manager_id
    - Ajouter advisor_brochure_url
    
  2. Sécurité
    - RLS activé
    - Politique publique pour démo
*/

-- Supprimer les contraintes de clés étrangères qui pointent vers user_profiles
ALTER TABLE google_sync DROP CONSTRAINT IF EXISTS google_sync_user_id_fkey;
ALTER TABLE per_simulations DROP CONSTRAINT IF EXISTS per_simulations_user_id_fkey;
ALTER TABLE library_documents DROP CONSTRAINT IF EXISTS library_documents_uploaded_by_fkey;
ALTER TABLE memos DROP CONSTRAINT IF EXISTS memos_assigned_to_fkey;
ALTER TABLE memos DROP CONSTRAINT IF EXISTS memos_created_by_fkey;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_assigned_to_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_assigned_to_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_created_by_fkey;
ALTER TABLE signataire_disponibilites DROP CONSTRAINT IF EXISTS signataire_disponibilites_user_id_fkey;
ALTER TABLE devoir_conseil_attachments DROP CONSTRAINT IF EXISTS devoir_conseil_attachments_uploaded_by_fkey;
ALTER TABLE email_config DROP CONSTRAINT IF EXISTS email_config_user_id_fkey;
ALTER TABLE user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;
ALTER TABLE user_activity_daily DROP CONSTRAINT IF EXISTS user_activity_daily_user_id_fkey;

-- Supprimer l'ancienne table
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Créer la nouvelle table avec la bonne structure
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_type text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  photo_url text,
  team_manager_id uuid,
  is_active boolean DEFAULT false,
  advisor_brochure_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to user_profiles"
  ON user_profiles FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Insérer les données des 6 utilisateurs
INSERT INTO user_profiles (id, profile_type, first_name, last_name, email, photo_url, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Philippine', 'Maniglier', 'philippine@bienviyance.fr', '/Philippine.jpg', true),
  ('22222222-2222-2222-2222-222222222222', 'Gestion', 'Mandje', 'Conseiller', 'mandje@bienviyance.fr', '/Mandje.jpg', false),
  ('33333333-3333-3333-3333-333333333333', 'Indicateur d''affaires', 'Moche', 'Apporteur', 'moche@bienviyance.fr', '/Moche.jpg', false),
  ('44444444-4444-4444-4444-444444444444', 'Gestion', 'Benjamin', 'Conseiller', 'benjamin@bienviyance.fr', '/Benjamin.jpg', false),
  ('55555555-5555-5555-5555-555555555555', 'Manager', 'Michael', 'Senior', 'michael@bienviyance.fr', '/Michael.jpg', false),
  ('66666666-6666-6666-6666-666666666666', 'Marketing', 'Ornella', 'Assistante', 'ornella@bienviyance.fr', '/Ornella.jpg', false);

-- Recréer les contraintes de clés étrangères
ALTER TABLE google_sync ADD CONSTRAINT google_sync_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id);
ALTER TABLE per_simulations ADD CONSTRAINT per_simulations_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id);
ALTER TABLE library_documents ADD CONSTRAINT library_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id);
ALTER TABLE memos ADD CONSTRAINT memos_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES user_profiles(id);
ALTER TABLE memos ADD CONSTRAINT memos_created_by_fkey FOREIGN KEY (created_by) REFERENCES user_profiles(id);
ALTER TABLE leads ADD CONSTRAINT leads_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES user_profiles(id);
ALTER TABLE appointments ADD CONSTRAINT appointments_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES user_profiles(id);
ALTER TABLE appointments ADD CONSTRAINT appointments_created_by_fkey FOREIGN KEY (created_by) REFERENCES user_profiles(id);
ALTER TABLE signataire_disponibilites ADD CONSTRAINT signataire_disponibilites_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id);
ALTER TABLE devoir_conseil_attachments ADD CONSTRAINT devoir_conseil_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id);
ALTER TABLE email_config ADD CONSTRAINT email_config_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id);
ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id);
ALTER TABLE user_activity_daily ADD CONSTRAINT user_activity_daily_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id);
