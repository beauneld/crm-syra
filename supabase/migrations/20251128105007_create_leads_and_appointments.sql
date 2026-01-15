/*
  # Tables Leads et Appointments
  
  1. Tables créées
    - leads: Gestion des prospects
      - Informations de contact
      - Statut du lead (nouveau, travaillé, rdv_pris, signé, perdu)
      - Assignation conseiller
      - Liste d'origine
    
    - appointments: Gestion des rendez-vous
      - Lié aux leads
      - Horaires de début et fin
      - Statut du RDV
      - Indicateur de signature
  
  2. Sécurité
    - RLS activé avec accès public pour tous
    - Index pour optimiser les recherches
  
  3. Relations
    - appointments.lead_id -> leads.id
    - appointments.user_id -> user_profiles.id
    - leads.user_id -> user_profiles.id
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

DROP POLICY IF EXISTS "Public can read leads" ON leads;
CREATE POLICY "Public can read leads"
  ON leads FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Public can insert leads" ON leads;
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update leads" ON leads;
CREATE POLICY "Public can update leads"
  ON leads FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete leads" ON leads;
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

DROP POLICY IF EXISTS "Public can read appointments" ON appointments;
CREATE POLICY "Public can read appointments"
  ON appointments FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Public can insert appointments" ON appointments;
CREATE POLICY "Public can insert appointments"
  ON appointments FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update appointments" ON appointments;
CREATE POLICY "Public can update appointments"
  ON appointments FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete appointments" ON appointments;
CREATE POLICY "Public can delete appointments"
  ON appointments FOR DELETE
  TO public
  USING (true);