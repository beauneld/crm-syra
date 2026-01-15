/*
  # Configuration complète du CRM avec données de démo
  
  1. Nouvelles Tables
    - `user_profiles` - Profils utilisateurs avec photos
    - `partners` - Partenaires
    - `google_sync` - Synchronisation Google
    - `organization_settings` - Paramètres organisation
    - `per_simulations` - Simulations PER
    - `library_documents` - Documents bibliothèque
    - `memos` - Mémos et notes
    - `leads` - Prospects (100)
    - `appointments` - Rendez-vous (20)
    - `signataire_disponibilites` - Disponibilités
    - `devoir_conseil_attachments` - Pièces jointes
    - `email_config` - Configuration email
    - `user_sessions` - Sessions (932)
    - `user_activity_daily` - Activité quotidienne (43 jours)
    
  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques publiques pour la démo
*/

-- Supprimer contraintes problématiques
ALTER TABLE predefined_messages DROP CONSTRAINT IF EXISTS predefined_messages_user_id_fkey;
ALTER TABLE devoirs_conseil DROP CONSTRAINT IF EXISTS devoirs_conseil_user_id_fkey;

-- user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'Conseiller',
  photo text,
  phone text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to user_profiles" ON user_profiles;
CREATE POLICY "Allow public access to user_profiles" ON user_profiles FOR ALL TO public USING (true) WITH CHECK (true);

-- partners
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  logo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to partners" ON partners;
CREATE POLICY "Allow public access to partners" ON partners FOR ALL TO public USING (true) WITH CHECK (true);

-- google_sync
CREATE TABLE IF NOT EXISTS google_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  access_token text,
  refresh_token text,
  calendar_id text,
  sheets_id text,
  sync_enabled boolean DEFAULT false,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE google_sync ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to google_sync" ON google_sync;
CREATE POLICY "Allow public access to google_sync" ON google_sync FOR ALL TO public USING (true) WITH CHECK (true);

-- organization_settings
CREATE TABLE IF NOT EXISTS organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name text NOT NULL DEFAULT 'Bienviyance',
  logo_light text,
  logo_dark text,
  primary_color text DEFAULT '#1a56db',
  secondary_color text DEFAULT '#7c3aed',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to organization_settings" ON organization_settings;
CREATE POLICY "Allow public access to organization_settings" ON organization_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- per_simulations
CREATE TABLE IF NOT EXISTS per_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  client_name text NOT NULL,
  age integer NOT NULL,
  annual_income numeric NOT NULL,
  contribution_amount numeric NOT NULL,
  retirement_age integer NOT NULL,
  tax_savings numeric,
  projected_capital numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE per_simulations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to per_simulations" ON per_simulations;
CREATE POLICY "Allow public access to per_simulations" ON per_simulations FOR ALL TO public USING (true) WITH CHECK (true);

-- library_documents
CREATE TABLE IF NOT EXISTS library_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  description text,
  tags text[],
  uploaded_by uuid REFERENCES user_profiles(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE library_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to library_documents" ON library_documents;
CREATE POLICY "Allow public access to library_documents" ON library_documents FOR ALL TO public USING (true) WITH CHECK (true);

-- memos
CREATE TABLE IF NOT EXISTS memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'medium',
  due_date date,
  assigned_to uuid REFERENCES user_profiles(id),
  created_by uuid REFERENCES user_profiles(id),
  status text DEFAULT 'pending',
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to memos" ON memos;
CREATE POLICY "Allow public access to memos" ON memos FOR ALL TO public USING (true) WITH CHECK (true);

-- leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  status text DEFAULT 'nouveau',
  source text,
  assigned_to uuid REFERENCES user_profiles(id),
  interest_level integer DEFAULT 0,
  last_contact_date timestamptz,
  next_action text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to leads" ON leads;
CREATE POLICY "Allow public access to leads" ON leads FOR ALL TO public USING (true) WITH CHECK (true);

-- appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  type text DEFAULT 'meeting',
  status text DEFAULT 'scheduled',
  assigned_to uuid REFERENCES user_profiles(id),
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to appointments" ON appointments;
CREATE POLICY "Allow public access to appointments" ON appointments FOR ALL TO public USING (true) WITH CHECK (true);

-- signataire_disponibilites
CREATE TABLE IF NOT EXISTS signataire_disponibilites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  day_of_week integer NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE signataire_disponibilites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to signataire_disponibilites" ON signataire_disponibilites;
CREATE POLICY "Allow public access to signataire_disponibilites" ON signataire_disponibilites FOR ALL TO public USING (true) WITH CHECK (true);

-- devoir_conseil_attachments
CREATE TABLE IF NOT EXISTS devoir_conseil_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  devoir_conseil_id uuid REFERENCES devoirs_conseil(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  uploaded_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE devoir_conseil_attachments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to devoir_conseil_attachments" ON devoir_conseil_attachments;
CREATE POLICY "Allow public access to devoir_conseil_attachments" ON devoir_conseil_attachments FOR ALL TO public USING (true) WITH CHECK (true);

-- email_config
CREATE TABLE IF NOT EXISTS email_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  smtp_host text,
  smtp_port integer,
  smtp_user text,
  smtp_password text,
  from_email text,
  from_name text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to email_config" ON email_config;
CREATE POLICY "Allow public access to email_config" ON email_config FOR ALL TO public USING (true) WITH CHECK (true);

-- user_sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  session_start timestamptz NOT NULL,
  session_end timestamptz,
  duration_minutes integer,
  page_views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to user_sessions" ON user_sessions;
CREATE POLICY "Allow public access to user_sessions" ON user_sessions FOR ALL TO public USING (true) WITH CHECK (true);

-- user_activity_daily
CREATE TABLE IF NOT EXISTS user_activity_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  activity_date date NOT NULL,
  total_sessions integer DEFAULT 0,
  total_duration_minutes integer DEFAULT 0,
  leads_contacted integer DEFAULT 0,
  appointments_created integer DEFAULT 0,
  contracts_created integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

ALTER TABLE user_activity_daily ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to user_activity_daily" ON user_activity_daily;
CREATE POLICY "Allow public access to user_activity_daily" ON user_activity_daily FOR ALL TO public USING (true) WITH CHECK (true);

-- DONNÉES DE DÉMO

-- User Profiles
INSERT INTO user_profiles (id, email, full_name, role, photo, phone, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'philippine@bienviyance.fr', 'Philippine Maniglier', 'Directrice', '/Philippine.jpg', '+33 6 12 34 56 78', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'mandje@bienviyance.fr', 'Mandje', 'Conseiller', '/Mandje.jpg', '+33 6 23 45 67 89', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'moche@bienviyance.fr', 'Moche', 'Apporteur d''affaires', '/Moche.jpg', '+33 6 34 56 78 90', 'active'),
  ('44444444-4444-4444-4444-444444444444', 'benjamin@bienviyance.fr', 'Benjamin', 'Conseiller', '/Benjamin.jpg', '+33 6 45 67 89 01', 'active'),
  ('55555555-5555-5555-5555-555555555555', 'michael@bienviyance.fr', 'Michael', 'Conseiller Senior', '/Michael.jpg', '+33 6 56 78 90 12', 'active'),
  ('66666666-6666-6666-6666-666666666666', 'ornella@bienviyance.fr', 'Ornella', 'Assistante', '/Ornella.jpg', '+33 6 67 89 01 23', 'active')
ON CONFLICT (id) DO NOTHING;

-- Partners
INSERT INTO partners (name, type, contact_name, email, phone, address, is_active) VALUES
  ('Assuravia', 'Assureur', 'Jean Dupont', 'contact@assuravia.fr', '+33 1 23 45 67 89', '15 Avenue des Champs, 75008 Paris', true),
  ('MutuelProtect', 'Mutuelle', 'Marie Martin', 'info@mutuelprotect.fr', '+33 1 34 56 78 90', '42 Rue de la Santé, 69003 Lyon', true),
  ('FinanceConseil', 'Courtier', 'Pierre Bernard', 'contact@financeconseil.fr', '+33 1 45 67 89 01', '8 Boulevard Haussmann, 75009 Paris', true),
  ('PrévoyancePlus', 'Assureur', 'Sophie Lambert', 's.lambert@prevoyanceplus.fr', '+33 1 56 78 90 12', '23 Rue Victor Hugo, 33000 Bordeaux', true),
  ('RetraiteOptima', 'Gestionnaire', 'Luc Petit', 'l.petit@retraiteoptima.fr', '+33 1 67 89 01 23', '67 Avenue Foch, 44000 Nantes', true),
  ('Patrimoine & Co', 'CGP', 'Claire Rousseau', 'c.rousseau@patrimoine-co.fr', '+33 1 78 90 12 34', '19 Cours Lafayette, 69006 Lyon', true)
ON CONFLICT DO NOTHING;

-- Organization Settings
INSERT INTO organization_settings (organization_name, logo_light, logo_dark, primary_color, secondary_color) VALUES
  ('Bienviyance', '/Bienviyance-logo-2.png', '/Bienviyance-logo-7.png', '#1a56db', '#7c3aed')
ON CONFLICT DO NOTHING;

-- Library Documents
INSERT INTO library_documents (title, category, file_url, file_type, description, tags, uploaded_by) VALUES
  ('Guide Assurance Vie 2024', 'Assurance Vie', '/docs/guide-av-2024.pdf', 'pdf', 'Guide complet sur l''assurance vie', ARRAY['assurance', 'fiscalité'], '11111111-1111-1111-1111-111111111111'),
  ('Comparatif Mutuelles Santé', 'Santé', '/docs/comparatif-mutuelles.pdf', 'pdf', 'Tableau comparatif mutuelles', ARRAY['santé', 'mutuelle'], '11111111-1111-1111-1111-111111111111'),
  ('PER - Plan Épargne Retraite', 'Retraite', '/docs/per-guide.pdf', 'pdf', 'Tout sur le PER', ARRAY['retraite', 'épargne'], '55555555-5555-5555-5555-555555555555'),
  ('Prévoyance TNS', 'Prévoyance', '/docs/prevoyance-tns.pdf', 'pdf', 'Guide prévoyance TNS', ARRAY['prévoyance', 'tns'], '22222222-2222-2222-2222-222222222222'),
  ('Assurance Emprunteur', 'Crédit', '/docs/assurance-emprunteur.pdf', 'pdf', 'Guide assurance emprunteur', ARRAY['crédit', 'assurance'], '44444444-4444-4444-4444-444444444444'),
  ('Fiscalité du Patrimoine', 'Fiscalité', '/docs/fiscalite-patrimoine.pdf', 'pdf', 'Optimisation fiscale', ARRAY['fiscalité', 'patrimoine'], '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- Memos
INSERT INTO memos (title, content, priority, due_date, assigned_to, created_by, status, is_completed) VALUES
  ('Rappeler client Dubois', 'Appeler M. Dubois pour finaliser dossier PER', 'high', CURRENT_DATE - 2, '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'overdue', false),
  ('Préparer présentation', 'Préparer présentation réunion demain', 'high', CURRENT_DATE, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'pending', false),
  ('Vérifier documents Martin', 'Vérifier documents dossier Martin', 'medium', CURRENT_DATE + 1, '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'pending', false),
  ('Formation équipe', 'Organiser formation nouveaux produits', 'medium', CURRENT_DATE + 3, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'pending', false),
  ('RDV partenaire', 'RDV avec Assuravia', 'high', CURRENT_DATE + 5, '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'pending', false),
  ('Relance prospects', 'Relancer prospects semaine dernière', 'medium', CURRENT_DATE + 7, '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'pending', false),
  ('MAJ bibliothèque', 'Mettre à jour bibliothèque', 'low', CURRENT_DATE + 10, '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'pending', false),
  ('Analyse performance', 'Analyser performances du mois', 'medium', CURRENT_DATE + 14, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'pending', false),
  ('Newsletter mensuelle', 'Préparer newsletter clients', 'low', CURRENT_DATE + 20, '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'pending', false),
  ('Audit conformité', 'Audit conformité trimestriel', 'high', CURRENT_DATE + 25, '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'pending', false),
  ('Planification Q2', 'Planifier objectifs Q2', 'medium', CURRENT_DATE + 30, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'pending', false),
  ('Révision contrats', 'Réviser contrats en cours', 'low', CURRENT_DATE - 5, '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'overdue', false)
ON CONFLICT DO NOTHING;

-- Leads initiaux
INSERT INTO leads (first_name, last_name, email, phone, status, source, assigned_to, interest_level, last_contact_date, notes) VALUES
  ('Jean', 'Dupont', 'j.dupont@email.fr', '0612345678', 'nouveau', 'Site web', '22222222-2222-2222-2222-222222222222', 8, CURRENT_DATE - 1, 'Intéressé par PER'),
  ('Marie', 'Martin', 'm.martin@email.fr', '0623456789', 'en_cours', 'Recommandation', '44444444-4444-4444-4444-444444444444', 9, CURRENT_DATE - 3, 'RDV prévu'),
  ('Pierre', 'Bernard', 'p.bernard@email.fr', '0634567890', 'qualifié', 'LinkedIn', '22222222-2222-2222-2222-222222222222', 7, CURRENT_DATE - 5, 'Mutuelle santé'),
  ('Sophie', 'Lambert', 's.lambert@email.fr', '0645678901', 'converti', 'Salon', '55555555-5555-5555-5555-555555555555', 10, CURRENT_DATE - 10, 'Contrat signé'),
  ('Luc', 'Petit', 'l.petit@email.fr', '0656789012', 'perdu', 'Publicité', '44444444-4444-4444-4444-444444444444', 3, CURRENT_DATE - 30, 'Ne répond plus'),
  ('Claire', 'Rousseau', 'c.rousseau@email.fr', '0667890123', 'nouveau', 'Site web', '22222222-2222-2222-2222-222222222222', 6, CURRENT_DATE, 'Premier contact'),
  ('Thomas', 'Moreau', 't.moreau@email.fr', '0678901234', 'en_cours', 'Recommandation', '55555555-5555-5555-5555-555555555555', 8, CURRENT_DATE - 2, 'Assurance vie'),
  ('Isabelle', 'Simon', 'i.simon@email.fr', '0689012345', 'qualifié', 'LinkedIn', '44444444-4444-4444-4444-444444444444', 9, CURRENT_DATE - 7, 'Profil TNS'),
  ('François', 'Michel', 'f.michel@email.fr', '0690123456', 'nouveau', 'Salon', '22222222-2222-2222-2222-222222222222', 5, CURRENT_DATE - 1, 'Demande info'),
  ('Nathalie', 'Leroy', 'n.leroy@email.fr', '0601234567', 'en_cours', 'Site web', '55555555-5555-5555-5555-555555555555', 7, CURRENT_DATE - 4, 'Comparaison');

-- 90 leads supplémentaires
DO $$
DECLARE
  prenoms text[] := ARRAY['Alexandre', 'Amélie', 'Antoine', 'Camille', 'Céline', 'Charles', 'Charlotte', 'Christophe', 'David', 'Élise', 'Emma', 'Éric', 'Florence', 'Frédéric', 'Guillaume', 'Hélène', 'Julien', 'Laura', 'Laurent', 'Léa', 'Louis', 'Lucie', 'Marc', 'Marine', 'Mathieu', 'Maxime', 'Nicolas', 'Olivier', 'Pascal', 'Paul'];
  noms text[] := ARRAY['André', 'Aubert', 'Barbier', 'Benoit', 'Bertrand', 'Blanc', 'Bonnet', 'Bourgeois', 'Boyer', 'Brun', 'Caron', 'Carpentier', 'Chevalier', 'Clement', 'Colin', 'David', 'Denis', 'Deschamps', 'Dubois', 'Dufour', 'Dumont', 'Dupuis', 'Durand', 'Fabre', 'Fontaine', 'Fournier', 'Garcia', 'Garnier', 'Gauthier', 'Gerard'];
  statuts text[] := ARRAY['nouveau', 'en_cours', 'qualifié', 'converti', 'perdu'];
  sources text[] := ARRAY['Site web', 'LinkedIn', 'Recommandation', 'Salon', 'Publicité', 'Partenaire'];
  conseillers uuid[] := ARRAY['22222222-2222-2222-2222-222222222222'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, '55555555-5555-5555-5555-555555555555'::uuid];
  i integer;
BEGIN
  FOR i IN 1..90 LOOP
    INSERT INTO leads (first_name, last_name, email, phone, status, source, assigned_to, interest_level, last_contact_date, notes)
    VALUES (
      prenoms[1 + (random() * (array_length(prenoms, 1) - 1))::int],
      noms[1 + (random() * (array_length(noms, 1) - 1))::int],
      'contact' || i::text || '@email.fr',
      '06' || lpad((random() * 100000000)::bigint::text, 8, '0'),
      statuts[1 + (random() * (array_length(statuts, 1) - 1))::int],
      sources[1 + (random() * (array_length(sources, 1) - 1))::int],
      conseillers[1 + (random() * (array_length(conseillers, 1) - 1))::int],
      1 + (random() * 9)::int,
      CURRENT_DATE - (random() * 60)::int,
      'Lead auto'
    );
  END LOOP;
END $$;

-- Appointments (20 RDV)
INSERT INTO appointments (lead_id, title, description, start_time, end_time, location, type, status, assigned_to, created_by)
SELECT 
  l.id,
  'RDV ' || l.first_name || ' ' || l.last_name,
  'Discussion besoins assurance',
  CURRENT_DATE + ((random() * 30)::int || ' days')::interval + ((9 + random() * 8)::int || ' hours')::interval,
  CURRENT_DATE + ((random() * 30)::int || ' days')::interval + ((10 + random() * 8)::int || ' hours')::interval,
  CASE (random() * 2)::int WHEN 0 THEN 'Bureau' WHEN 1 THEN 'Visio' ELSE 'Domicile' END,
  CASE (random() * 2)::int WHEN 0 THEN 'meeting' WHEN 1 THEN 'call' ELSE 'video' END,
  'scheduled',
  l.assigned_to,
  '11111111-1111-1111-1111-111111111111'
FROM (SELECT id, first_name, last_name, assigned_to FROM leads WHERE status IN ('en_cours', 'qualifié') ORDER BY random() LIMIT 20) l;

-- Signataire disponibilites
INSERT INTO signataire_disponibilites (user_id, day_of_week, start_time, end_time) VALUES
  ('11111111-1111-1111-1111-111111111111', 1, '09:00', '12:00'),
  ('11111111-1111-1111-1111-111111111111', 3, '14:00', '18:00')
ON CONFLICT DO NOTHING;

-- Predefined Messages
INSERT INTO predefined_messages (title, content, category, is_active) VALUES
  ('Bienvenue', 'Bonjour, merci de votre intérêt. Je serais ravi de vous accompagner.', 'salutation', true),
  ('Relance RDV', 'Suite à notre échange, je vous envoie les documents.', 'follow_up', true),
  ('Demande docs', 'Pour finaliser, j''aurais besoin des documents suivants...', 'request', true)
ON CONFLICT DO NOTHING;

-- Lead Comments
INSERT INTO lead_comments (lead_id, user_id, content)
SELECT l.id::text, '22222222-2222-2222-2222-222222222222'::uuid, 'Premier contact établi, prospect intéressé.'
FROM leads l WHERE l.status = 'en_cours' LIMIT 10;

-- User Sessions (932)
DO $$
DECLARE
  users uuid[] := ARRAY['11111111-1111-1111-1111-111111111111'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, '66666666-6666-6666-6666-666666666666'::uuid];
  i integer;
  u_id uuid;
  s_date timestamptz;
  dur integer;
BEGIN
  FOR i IN 1..932 LOOP
    u_id := users[1 + (random() * (array_length(users, 1) - 1))::int];
    s_date := CURRENT_TIMESTAMP - ((random() * 30)::int || ' days')::interval - ((random() * 9)::int || ' hours')::interval;
    dur := 15 + (random() * 180)::int;
    INSERT INTO user_sessions (user_id, session_start, session_end, duration_minutes, page_views)
    VALUES (u_id, s_date, s_date + (dur || ' minutes')::interval, dur, 5 + (random() * 50)::int);
  END LOOP;
END $$;

-- User Activity Daily (43 jours)
INSERT INTO user_activity_daily (user_id, activity_date, total_sessions, total_duration_minutes, leads_contacted, appointments_created, contracts_created)
SELECT 
  u.id,
  CURRENT_DATE - d,
  1 + (random() * 10)::int,
  30 + (random() * 300)::int,
  (random() * 15)::int,
  (random() * 5)::int,
  (random() * 3)::int
FROM user_profiles u
CROSS JOIN generate_series(0, 42) d
WHERE u.role IN ('Conseiller', 'Conseiller Senior', 'Directrice')
ON CONFLICT (user_id, activity_date) DO NOTHING;

-- MAJ politiques existantes
DROP POLICY IF EXISTS "Allow public access to profiles" ON profiles;
CREATE POLICY "Allow public access to profiles" ON profiles FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to devoirs_conseil" ON devoirs_conseil;
CREATE POLICY "Allow public access to devoirs_conseil" ON devoirs_conseil FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to contracts" ON contracts;
CREATE POLICY "Allow public access to contracts" ON contracts FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to lead_comments" ON lead_comments;
CREATE POLICY "Allow public access to lead_comments" ON lead_comments FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to predefined_messages" ON predefined_messages;
CREATE POLICY "Allow public access to predefined_messages" ON predefined_messages FOR ALL TO public USING (true) WITH CHECK (true);
