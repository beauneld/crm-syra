/*
  # Create Financial Management Tables
  
  This migration creates all tables needed for commission tracking and financial management:
  1. **fournisseurs_commissions** - Supplier/provider configuration
  2. **commissions_attendues** - Expected commissions tracking
  3. **releves_bancaires** - Bank statement uploads
  4. **virements** - Bank transfers from statements
  5. **bordereaux** - Commission statements from suppliers
  6. **relances_fournisseurs** - Supplier reminder tracking
  
  ## Security
  - RLS enabled on all tables
  - Public access policies for demo
*/

-- 1. Fournisseurs Commissions Table
CREATE TABLE IF NOT EXISTS fournisseurs_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  taux_initial numeric DEFAULT 0,
  taux_recurrent numeric DEFAULT 0,
  delai_versement_jours integer DEFAULT 30,
  noms_libelle text[] DEFAULT '{}',
  paiement_regroupe boolean DEFAULT false,
  contact_email text,
  contact_phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fournisseurs_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to fournisseurs_commissions"
  ON fournisseurs_commissions FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. Commissions Attendues Table
CREATE TABLE IF NOT EXISTS commissions_attendues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  contract_id text,
  fournisseur_id text NOT NULL,
  montant_attendu numeric NOT NULL,
  date_estimee date NOT NULL,
  date_virement date,
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_retard', 'reçue', 'partielle', 'litige')),
  type_commission text DEFAULT 'initial' CHECK (type_commission IN ('initial', 'recurrent')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE commissions_attendues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to commissions_attendues"
  ON commissions_attendues FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Relevés Bancaires Table
CREATE TABLE IF NOT EXISTS releves_bancaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  banque text NOT NULL,
  fichier_nom text NOT NULL,
  fichier_url text,
  date_reception date NOT NULL,
  statut_parsing text DEFAULT 'ok' CHECK (statut_parsing IN ('ok', 'en_cours', 'erreur')),
  nb_virements_detectes integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE releves_bancaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to releves_bancaires"
  ON releves_bancaires FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Virements Table
CREATE TABLE IF NOT EXISTS virements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  releve_id uuid REFERENCES releves_bancaires(id) ON DELETE CASCADE,
  montant numeric NOT NULL,
  date_virement date NOT NULL,
  libelle text NOT NULL,
  statut text DEFAULT 'non_rapproche' CHECK (statut IN ('rapproche', 'non_rapproche', 'litige')),
  fournisseur_detecte text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE virements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to virements"
  ON virements FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Bordereaux Table
CREATE TABLE IF NOT EXISTS bordereaux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  fournisseur_id text NOT NULL,
  fichier_nom text NOT NULL,
  fichier_url text,
  date_reception date NOT NULL,
  periode_debut date,
  periode_fin date,
  nb_commissions_declarees integer DEFAULT 0,
  statut_matching text DEFAULT 'non_traite' CHECK (statut_matching IN ('ok', 'partiel', 'a_verifier', 'non_traite')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bordereaux ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to bordereaux"
  ON bordereaux FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Relances Fournisseurs Table
CREATE TABLE IF NOT EXISTS relances_fournisseurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  commission_id uuid REFERENCES commissions_attendues(id) ON DELETE CASCADE,
  fournisseur_id text NOT NULL,
  type_relance text NOT NULL,
  date_relance timestamptz NOT NULL,
  statut text DEFAULT 'envoyee' CHECK (statut IN ('envoyee', 'repondue', 'sans_reponse')),
  prochaine_relance date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE relances_fournisseurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to relances_fournisseurs"
  ON relances_fournisseurs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_commissions_attendues_org ON commissions_attendues(organization_id);
CREATE INDEX IF NOT EXISTS idx_commissions_attendues_statut ON commissions_attendues(statut);
CREATE INDEX IF NOT EXISTS idx_commissions_attendues_fournisseur ON commissions_attendues(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_virements_releve ON virements(releve_id);
CREATE INDEX IF NOT EXISTS idx_virements_statut ON virements(statut);
CREATE INDEX IF NOT EXISTS idx_bordereaux_fournisseur ON bordereaux(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_relances_commission ON relances_fournisseurs(commission_id);
