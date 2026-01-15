import { supabase } from '../lib/supabase';

export interface CommissionAttendue {
  id: string;
  organization_id: string;
  contract_id: string;
  fournisseur_id: string;
  montant_attendu: number;
  date_estimee: string;
  date_virement?: string;
  statut: 'en_attente' | 'en_retard' | 'reçue' | 'partielle' | 'litige';
  type_commission: 'initial' | 'recurrent';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Fournisseur {
  id: string;
  organization_id: string;
  name: string;
  taux_initial: number;
  taux_recurrent: number;
  delai_versement_jours: number;
  noms_libelle: string[];
  paiement_regroupe: boolean;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RelevesBancaires {
  id: string;
  organization_id: string;
  banque: string;
  fichier_nom: string;
  fichier_url?: string;
  date_reception: string;
  statut_parsing: 'ok' | 'en_cours' | 'erreur';
  nb_virements_detectes: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Virement {
  id: string;
  organization_id: string;
  releve_id: string;
  montant: number;
  date_virement: string;
  libelle: string;
  statut: 'rapproche' | 'non_rapproche' | 'litige';
  fournisseur_detecte?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Bordereau {
  id: string;
  organization_id: string;
  fournisseur_id: string;
  fichier_nom: string;
  fichier_url?: string;
  date_reception: string;
  periode_debut?: string;
  periode_fin?: string;
  nb_commissions_declarees: number;
  statut_matching: 'ok' | 'partiel' | 'a_verifier' | 'non_traite';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// COMMISSIONS
export async function getCommissionsAttendu(filters?: {
  statut?: string;
  fournisseur_id?: string;
  periode?: string;
}): Promise<CommissionAttendue[]> {
  let query = supabase.from('commissions_attendues').select('*');

  if (filters?.statut) {
    query = query.eq('statut', filters.statut);
  }
  if (filters?.fournisseur_id) {
    query = query.eq('fournisseur_id', filters.fournisseur_id);
  }

  const { data, error } = await query.order('date_estimee', { ascending: false });

  if (error) throw new Error(`Erreur commissions: ${error.message}`);
  return data || [];
}

export async function getStatistiquesCommissions(): Promise<any> {
  const { data: commissions } = await supabase.from('commissions_attendues').select('*');

  if (!commissions) return null;

  const total = commissions.reduce((sum: number, c: any) => sum + c.montant_attendu, 0);
  const reçue = commissions
    .filter((c: any) => c.statut === 'reçue')
    .reduce((sum: number, c: any) => sum + c.montant_attendu, 0);

  const enRetard = commissions.filter((c: any) => c.statut === 'en_retard').length;
  const partielle = commissions.filter((c: any) => c.statut === 'partielle').length;

  return {
    total,
    reçue,
    taux_paiement: (reçue / total * 100).toFixed(1),
    en_retard: enRetard,
    partielle: partielle,
  };
}

// FOURNISSEURS
export async function getFournisseurs(): Promise<Fournisseur[]> {
  const { data, error } = await supabase
    .from('fournisseurs_commissions')
    .select('*')
    .eq('is_active', true);

  if (error) throw new Error(`Erreur fournisseurs: ${error.message}`);
  return data || [];
}

export async function updateFournisseur(id: string, updates: Partial<Fournisseur>): Promise<void> {
  const { error } = await supabase
    .from('fournisseurs_commissions')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(`Erreur mise à jour fournisseur: ${error.message}`);
}

// RELEVÉS BANCAIRES
export async function getRelevesBancaires(): Promise<RelevesBancaires[]> {
  const { data, error } = await supabase
    .from('releves_bancaires')
    .select('*')
    .order('date_reception', { ascending: false });

  if (error) throw new Error(`Erreur relevés: ${error.message}`);
  return data || [];
}

export async function getVirementsByReleve(releveId: string): Promise<Virement[]> {
  const { data, error } = await supabase
    .from('virements')
    .select('*')
    .eq('releve_id', releveId);

  if (error) throw new Error(`Erreur virements: ${error.message}`);
  return data || [];
}

// BORDEREAUX
export async function getBordereaux(): Promise<Bordereau[]> {
  const { data, error } = await supabase
    .from('bordereaux')
    .select('*')
    .order('date_reception', { ascending: false });

  if (error) throw new Error(`Erreur bordereaux: ${error.message}`);
  return data || [];
}

export async function updateBordereau(id: string, updates: Partial<Bordereau>): Promise<void> {
  const { error } = await supabase
    .from('bordereaux')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(`Erreur mise à jour bordereau: ${error.message}`);
}

// RELANCES
export async function createRelance(data: {
  commission_id: string;
  fournisseur_id: string;
  type_relance: string;
}): Promise<void> {
  const { error } = await supabase
    .from('relances_fournisseurs')
    .insert({
      ...data,
      organization_id: '1',
      date_relance: new Date().toISOString(),
      statut: 'envoyee',
      prochaine_relance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

  if (error) throw new Error(`Erreur relance: ${error.message}`);
}
