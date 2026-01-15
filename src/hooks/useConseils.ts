import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ConseilData {
  id?: string;
  client_name: string;
  besoins: string;
  risques: string;
  budget: string;
  situation_familiale: string;
  situation_professionnelle: string;
  projets: string;
  autres_remarques: string;
  produits_proposes: string;
  garanties: string;
  exclusions: string;
  limites: string;
  conditions: string;
  contrat_choisi: string;
  options: string;
  montants_garantie: string;
  adequation_confirmee: boolean;
  risques_refus: string;
  signature_client: string;
  date_signature: string;
  created_at?: string;
  [key: string]: any;
}

export function useConseils() {
  const [conseils, setConseils] = useState<ConseilData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConseils = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setConseils([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('devoirs_conseil')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading conseils:', error);
      setConseils([]);
    } else {
      setConseils(data || []);
    }
    setLoading(false);
  };

  const deleteConseil = async (id: string) => {
    const { error } = await supabase
      .from('devoirs_conseil')
      .delete()
      .eq('id', id);

    if (!error) {
      loadConseils();
    }
  };

  useEffect(() => {
    loadConseils();
  }, []);

  return {
    conseils,
    loading,
    loadConseils,
    deleteConseil
  };
}
