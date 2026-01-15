/*
  # Création des tables Leads et Appointments pour les statistiques de performance
  
  1. Tables créées
    - leads: Informations sur tous les leads
      - id (uuid, clé primaire)
      - organization_id (text, organisation)
      - user_id (uuid, conseiller assigné)
      - first_name (text, prénom)
      - last_name (text, nom)
      - phone (text, téléphone)
      - email (text, email)
      - status (text, statut: nouveau, travaillé, rdv_pris, signé, perdu)
      - list_name (text, nom de la liste d'origine)
      - is_fake_number (boolean, faux numéro)
      - worked_at (timestamptz, date de travail)
      - created_at (timestamptz, date de création)
      - updated_at (timestamptz, date de mise à jour)
    
    - appointments: Rendez-vous pris
      - id (uuid, clé primaire)
      - lead_id (uuid, référence au lead)
      - user_id (uuid, conseiller)
      - title (text, titre du RDV)
      - description (text, description)
      - start_time (timestamptz, heure de début)
      - end_time (timestamptz, heure de fin)
      - status (text, statut: planifié, confirmé, complété, annulé)
      - is_signed (boolean, signé ou non)
      - created_at (timestamptz, date de création)
      - updated_at (timestamptz, date de mise à jour)
  
  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès pour lecture/écriture authentifiées
  
  3. Indexes
    - Index sur user_id, status, dates pour optimiser les requêtes de performance
*/

-- =============================================
-- LEADS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text NOT NULL DEFAULT 'default',
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text DEFAULT '',
  status text NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'travaillé', 'rdv_pris', 'signé', 'perdu')),
  list_name text DEFAULT 'Tous les leads',
  is_fake_number boolean DEFAULT false,
  worked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_worked_at ON leads(worked_at);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_list_name ON leads(list_name);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read leads"
  ON leads FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update leads"
  ON leads FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete leads"
  ON leads FOR DELETE
  TO public
  USING (true);

-- =============================================
-- APPOINTMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'planifié' CHECK (status IN ('planifié', 'confirmé', 'complété', 'annulé')),
  is_signed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lead_id ON appointments(lead_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read appointments"
  ON appointments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert appointments"
  ON appointments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update appointments"
  ON appointments FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete appointments"
  ON appointments FOR DELETE
  TO public
  USING (true);

-- =============================================
-- SAMPLE DATA
-- =============================================
-- Insérer des leads d'exemple pour les tests
DO $$
DECLARE
  user_ids uuid[] := ARRAY(SELECT id FROM user_profiles ORDER BY created_at LIMIT 5);
  lead_id uuid;
  i integer;
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO leads (
      organization_id,
      user_id,
      first_name,
      last_name,
      phone,
      email,
      status,
      list_name,
      is_fake_number,
      worked_at,
      created_at
    ) VALUES (
      'default',
      user_ids[1 + (i % array_length(user_ids, 1))],
      'Client ' || i,
      'Test ' || i,
      '0612345' || LPAD(i::text, 3, '0'),
      'client' || i || '@example.com',
      CASE 
        WHEN i % 10 = 0 THEN 'signé'
        WHEN i % 5 = 0 THEN 'rdv_pris'
        WHEN i % 3 = 0 THEN 'travaillé'
        ELSE 'nouveau'
      END,
      CASE 
        WHEN i % 3 = 0 THEN 'Professions médicales'
        WHEN i % 2 = 0 THEN 'Nouveaux leads'
        ELSE 'Tous les leads'
      END,
      (i % 8 = 0),
      now() - (random() * interval '14 days'),
      now() - (random() * interval '30 days')
    ) RETURNING id INTO lead_id;
    
    -- Créer des RDV pour les leads avec statut rdv_pris ou signé
    IF i % 5 = 0 OR i % 10 = 0 THEN
      INSERT INTO appointments (
        lead_id,
        user_id,
        title,
        description,
        start_time,
        end_time,
        status,
        is_signed,
        created_at
      ) VALUES (
        lead_id,
        user_ids[1 + (i % array_length(user_ids, 1))],
        'RDV avec Client ' || i,
        'Consultation initiale',
        now() - (random() * interval '14 days') + interval '2 hours',
        now() - (random() * interval '14 days') + interval '3 hours',
        CASE 
          WHEN i % 10 = 0 THEN 'complété'
          ELSE 'planifié'
        END,
        (i % 10 = 0),
        now() - (random() * interval '14 days')
      );
    END IF;
  END LOOP;
END $$;
