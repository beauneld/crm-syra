/*
  # Clean and Reset Complete Database
  
  This migration removes all existing tables and recreates the complete CRM database structure.
  
  ## Action
  - Drops all existing CRM tables
  - Recreates complete database structure with proper relationships
  - Enables RLS on all tables with public access policies
*/

-- Drop all existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS user_daily_activity CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS per_simulations CASCADE;
DROP TABLE IF EXISTS memos CASCADE;
DROP TABLE IF EXISTS library_documents CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS lead_comments CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS devoirs_conseil CASCADE;
DROP TABLE IF EXISTS predefined_messages CASCADE;
DROP TABLE IF EXISTS email_config CASCADE;
DROP TABLE IF EXISTS google_sync CASCADE;
DROP TABLE IF EXISTS organization_settings CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS lists CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. Organizations Table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to organizations"
  ON organizations FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. User Profiles Table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  profile_type text NOT NULL CHECK (profile_type IN ('Admin', 'Manager', 'Gestion', 'Signataire', 'Indicateur d''affaires', 'Marketing')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  photo_url text,
  team_manager_id uuid REFERENCES user_profiles(id),
  is_active boolean DEFAULT true,
  advisor_brochure_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to user_profiles"
  ON user_profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Lists Table
CREATE TABLE lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text DEFAULT 'importés' CHECK (type IN ('importés', 'manuels')),
  lead_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to lists"
  ON lists FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Leads Table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  list_id uuid REFERENCES lists(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text NOT NULL,
  status text DEFAULT 'Sans statut' CHECK (status IN ('Sans statut', 'NRP', 'Nul', 'À rappeler', 'Intéressé', 'RDV pris', 'RDV honoré', 'Signé', 'RDV manqué', 'Faux numéro', 'Pas intéressé')),
  nrp_count integer DEFAULT 0,
  rdv_count integer DEFAULT 0,
  owner text,
  owner_since timestamptz,
  status_updated_at timestamptz,
  status_updated_by text,
  imposition text,
  birth_year integer,
  postal_code text,
  city text,
  profession text,
  residence_status text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to leads"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Lead Comments Table
CREATE TABLE lead_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lead_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to lead_comments"
  ON lead_comments FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Appointments Table
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  google_calendar_id text,
  outlook_calendar_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to appointments"
  ON appointments FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Partners Table
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to partners"
  ON partners FOR ALL
  USING (true)
  WITH CHECK (true);

-- 8. API Keys Table
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  key_preview text NOT NULL,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  is_active boolean DEFAULT true
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to api_keys"
  ON api_keys FOR ALL
  USING (true)
  WITH CHECK (true);

-- 9. Organization Settings Table
CREATE TABLE organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  logo_url text,
  logo_dark_url text,
  primary_color text DEFAULT '#3b82f6',
  secondary_color text DEFAULT '#1e40af',
  company_name text,
  address text,
  phone text,
  email text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to organization_settings"
  ON organization_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- 10. Google Sync Table
CREATE TABLE google_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  calendar_enabled boolean DEFAULT false,
  calendar_id text,
  sheets_enabled boolean DEFAULT false,
  spreadsheet_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE google_sync ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to google_sync"
  ON google_sync FOR ALL
  USING (true)
  WITH CHECK (true);

-- 11. Email Config Table
CREATE TABLE email_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  smtp_host text NOT NULL,
  smtp_port integer NOT NULL,
  smtp_secure boolean DEFAULT true,
  smtp_user text NOT NULL,
  smtp_password text NOT NULL,
  from_name text NOT NULL,
  from_email text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to email_config"
  ON email_config FOR ALL
  USING (true)
  WITH CHECK (true);

-- 12. Predefined Messages Table
CREATE TABLE predefined_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'description' CHECK (category IN ('description', 'justification', 'recommendation')),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE predefined_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to predefined_messages"
  ON predefined_messages FOR ALL
  USING (true)
  WITH CHECK (true);

-- 13. Devoirs Conseil Table
CREATE TABLE devoirs_conseil (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  besoins text DEFAULT '',
  risques text DEFAULT '',
  budget text DEFAULT '',
  situation_familiale text DEFAULT '',
  situation_professionnelle text DEFAULT '',
  projets text DEFAULT '',
  autres_remarques text DEFAULT '',
  produits_proposes text DEFAULT '',
  garanties text DEFAULT '',
  exclusions text DEFAULT '',
  limites text DEFAULT '',
  conditions text DEFAULT '',
  contrat_choisi text DEFAULT '',
  options text DEFAULT '',
  montants_garantie text DEFAULT '',
  adequation_confirmee boolean DEFAULT false,
  risques_refus text DEFAULT '',
  signature_client text DEFAULT '',
  date_signature date DEFAULT CURRENT_DATE,
  user_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE devoirs_conseil ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to devoirs_conseil"
  ON devoirs_conseil FOR ALL
  USING (true)
  WITH CHECK (true);

-- 14. Contracts Table
CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  contract_type text NOT NULL,
  amount numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected', 'in_review')),
  validation_date timestamptz,
  error_type text CHECK (error_type IN ('missing_document', 'invalid_iban', 'invalid_proof', 'signature_missing', 'other') OR error_type IS NULL),
  is_reprise boolean DEFAULT false,
  reprise_success boolean,
  assureur text,
  gamme_contrat text,
  en_portefeuille boolean DEFAULT false,
  loi_madelin boolean DEFAULT false,
  contrat_principal boolean DEFAULT false,
  numero_contrat text,
  delegataire_gestion text,
  attentes text,
  commentaires text,
  date_souscription date,
  date_effet date,
  date_echeance date,
  montant_initial numeric,
  versement_programme numeric,
  periodicite text,
  devoir_conseil_id uuid REFERENCES devoirs_conseil(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to contracts"
  ON contracts FOR ALL
  USING (true)
  WITH CHECK (true);

-- 15. Library Documents Table
CREATE TABLE library_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  category text NOT NULL CHECK (category IN ('Contrats', 'Bienviyance', 'Prévoyance')),
  sub_category text CHECK (sub_category IN ('PER', 'Assurance Vie', 'Prévoyance') OR sub_category IS NULL),
  uploaded_by uuid REFERENCES user_profiles(id),
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE library_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to library_documents"
  ON library_documents FOR ALL
  USING (true)
  WITH CHECK (true);

-- 16. Memos Table
CREATE TABLE memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  due_time text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to memos"
  ON memos FOR ALL
  USING (true)
  WITH CHECK (true);

-- 17. PER Simulations Table
CREATE TABLE per_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  birth_year integer NOT NULL,
  retirement_age integer NOT NULL,
  current_savings numeric DEFAULT 0,
  monthly_contribution numeric NOT NULL,
  annual_return_rate numeric DEFAULT 4.0,
  tax_rate numeric DEFAULT 30.0,
  simulation_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE per_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to per_simulations"
  ON per_simulations FOR ALL
  USING (true)
  WITH CHECK (true);

-- 18. User Sessions Table
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_start timestamptz NOT NULL,
  session_end timestamptz,
  duration_seconds integer,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to user_sessions"
  ON user_sessions FOR ALL
  USING (true)
  WITH CHECK (true);

-- 19. User Daily Activity Table
CREATE TABLE user_daily_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_date date NOT NULL,
  total_duration_seconds integer DEFAULT 0,
  session_count integer DEFAULT 0,
  first_login timestamptz,
  last_logout timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

ALTER TABLE user_daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to user_daily_activity"
  ON user_daily_activity FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_leads_organization ON leads(organization_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_owner ON leads(owner);
CREATE INDEX idx_leads_list ON leads(list_id);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_lead ON appointments(lead_id);
CREATE INDEX idx_appointments_start ON appointments(start_time);
CREATE INDEX idx_memos_user ON memos(user_id);
CREATE INDEX idx_memos_status ON memos(status);
CREATE INDEX idx_memos_due_date ON memos(due_date);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_daily_activity_user ON user_daily_activity(user_id);
CREATE INDEX idx_user_daily_activity_date ON user_daily_activity(activity_date);
CREATE INDEX idx_contracts_organization ON contracts(organization_id);
CREATE INDEX idx_contracts_lead ON contracts(lead_id);
CREATE INDEX idx_library_documents_organization ON library_documents(organization_id);
CREATE INDEX idx_library_documents_category ON library_documents(category);
