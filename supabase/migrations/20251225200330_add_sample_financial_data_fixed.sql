/*
  # Add Sample Financial Data (Fixed)
  
  This migration adds realistic sample data for:
  - Suppliers (fournisseurs)
  - Expected commissions
  - Bank statements
  - Transfers
  - Supplier statements (bordereaux)
*/

-- Insert sample suppliers
INSERT INTO fournisseurs_commissions (
  id, organization_id, name, taux_initial, taux_recurrent, 
  delai_versement_jours, noms_libelle, paiement_regroupe, 
  contact_email, contact_phone, is_active, created_at, updated_at
)
VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'MMA',
    4.5,
    0.5,
    45,
    ARRAY['MMA ASSURANCES', 'COVEA MMA', 'MMA IARD'],
    true,
    'commissions@mma.fr',
    '0800123456',
    true,
    now(),
    now()
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Generali',
    5.0,
    0.75,
    60,
    ARRAY['GENERALI VIE', 'GENERALI FRANCE', 'GENERALI EPARGNE'],
    false,
    'partenaires@generali.fr',
    '0800234567',
    true,
    now(),
    now()
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'SwissLife',
    4.0,
    1.0,
    30,
    ARRAY['SWISS LIFE', 'SWISSLIFE ASSURANCE', 'SWISS LIFE PREVOYANCE'],
    true,
    'commissions@swisslife.fr',
    '0800345678',
    true,
    now(),
    now()
  ),
  (
    '60000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Axa',
    4.8,
    0.6,
    45,
    ARRAY['AXA FRANCE', 'AXA VIE', 'AXA ASSURANCE'],
    true,
    'partenaires@axa.fr',
    '0800456789',
    true,
    now(),
    now()
  ),
  (
    '60000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Allianz',
    4.2,
    0.8,
    30,
    ARRAY['ALLIANZ VIE', 'ALLIANZ FRANCE', 'ALLIANZ IARD'],
    false,
    'commissions@allianz.fr',
    '0800567890',
    true,
    now(),
    now()
  );

-- Insert expected commissions
INSERT INTO commissions_attendues (
  id, organization_id, contract_id, fournisseur_id, montant_attendu, 
  date_estimee, date_virement, statut, type_commission, notes, created_at, updated_at
)
VALUES
  -- Commissions reçues
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'PER-2024-001',
    'MMA',
    2500.00,
    CURRENT_DATE - 15,
    CURRENT_DATE - 10,
    'reçue',
    'initial',
    'Commission initiale sur PER - Client Marie Moreau',
    now() - interval '20 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'AV-2024-045',
    'Generali',
    3200.00,
    CURRENT_DATE - 30,
    CURRENT_DATE - 25,
    'reçue',
    'initial',
    'Commission initiale assurance vie',
    now() - interval '35 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'PER-2024-012',
    'SwissLife',
    1800.00,
    CURRENT_DATE - 20,
    CURRENT_DATE - 18,
    'reçue',
    'initial',
    'PER souscrit en novembre',
    now() - interval '25 days',
    now()
  ),
  -- Commissions en attente
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'PER-2024-056',
    'MMA',
    2800.00,
    CURRENT_DATE + 10,
    NULL,
    'en_attente',
    'initial',
    'Commission attendue pour janvier',
    now() - interval '5 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'AV-2024-078',
    'Axa',
    3500.00,
    CURRENT_DATE + 15,
    NULL,
    'en_attente',
    'initial',
    'Contrat en cours de validation',
    now() - interval '3 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'PREV-2024-023',
    'Allianz',
    1500.00,
    CURRENT_DATE + 20,
    NULL,
    'en_attente',
    'initial',
    'Prévoyance professionnelle',
    now() - interval '2 days',
    now()
  ),
  -- Commissions en retard
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'PER-2024-034',
    'Generali',
    2200.00,
    CURRENT_DATE - 45,
    NULL,
    'en_retard',
    'initial',
    'Retard de paiement - Relance effectuée',
    now() - interval '50 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'AV-2024-019',
    'MMA',
    4100.00,
    CURRENT_DATE - 30,
    NULL,
    'en_retard',
    'initial',
    'En attente de justificatif',
    now() - interval '35 days',
    now()
  ),
  -- Commissions partielles
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'PER-2024-067',
    'SwissLife',
    3000.00,
    CURRENT_DATE - 10,
    CURRENT_DATE - 5,
    'partielle',
    'initial',
    'Seulement 2500€ reçus au lieu de 3000€',
    now() - interval '15 days',
    now()
  ),
  -- Litige
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'AV-2024-089',
    'Axa',
    5200.00,
    CURRENT_DATE - 60,
    NULL,
    'litige',
    'initial',
    'Litige sur le montant - Contact juridique en cours',
    now() - interval '65 days',
    now()
  ),
  -- Commissions récurrentes
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'AV-2023-145',
    'Generali',
    250.00,
    CURRENT_DATE - 5,
    CURRENT_DATE - 2,
    'reçue',
    'recurrent',
    'Commission récurrente trimestre Q4',
    now() - interval '10 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'PER-2023-098',
    'MMA',
    180.00,
    CURRENT_DATE + 5,
    NULL,
    'en_attente',
    'recurrent',
    'Commission récurrente mensuelle',
    now() - interval '1 day',
    now()
  );

-- Insert bank statements
INSERT INTO releves_bancaires (
  id, organization_id, banque, fichier_nom, fichier_url, 
  date_reception, statut_parsing, nb_virements_detectes, notes, created_at, updated_at
)
VALUES
  (
    '70000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'BNP Paribas',
    'releve_bnp_novembre_2024.csv',
    'https://example.com/releves/releve_bnp_nov.csv',
    CURRENT_DATE - 30,
    'ok',
    15,
    'Relevé mensuel novembre 2024',
    now() - interval '30 days',
    now()
  ),
  (
    '70000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'BNP Paribas',
    'releve_bnp_decembre_2024.csv',
    'https://example.com/releves/releve_bnp_dec.csv',
    CURRENT_DATE - 5,
    'ok',
    12,
    'Relevé mensuel décembre 2024',
    now() - interval '5 days',
    now()
  ),
  (
    '70000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Société Générale',
    'releve_sg_novembre_2024.csv',
    'https://example.com/releves/releve_sg_nov.csv',
    CURRENT_DATE - 28,
    'ok',
    8,
    'Compte secondaire',
    now() - interval '28 days',
    now()
  );

-- Insert transfers
INSERT INTO virements (
  id, organization_id, releve_id, montant, date_virement, 
  libelle, statut, fournisseur_detecte, notes, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000001',
    2500.00,
    CURRENT_DATE - 25,
    'VIR MMA ASSURANCES COMMISSIONS',
    'rapproche',
    'MMA',
    'Rapproché avec commission PER-2024-001',
    now() - interval '25 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000001',
    3200.00,
    CURRENT_DATE - 20,
    'VIR GENERALI VIE PARTENARIAT',
    'rapproche',
    'Generali',
    'Rapproché avec commission AV-2024-045',
    now() - interval '20 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000002',
    1800.00,
    CURRENT_DATE - 18,
    'VIR SWISS LIFE ASSURANCE',
    'rapproche',
    'SwissLife',
    'Rapproché avec commission PER-2024-012',
    now() - interval '18 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000002',
    2500.00,
    CURRENT_DATE - 5,
    'VIR SWISS LIFE PREVOYANCE PARTIEL',
    'litige',
    'SwissLife',
    'Montant partiel - 500€ manquants',
    now() - interval '5 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000002',
    1250.00,
    CURRENT_DATE - 3,
    'VIR ACOMPTE CLIENT DURAND',
    'non_rapproche',
    NULL,
    'Non identifié - À vérifier',
    now() - interval '3 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000003',
    250.00,
    CURRENT_DATE - 2,
    'VIR GENERALI VIE RECURRENT T4',
    'rapproche',
    'Generali',
    'Commission récurrente',
    now() - interval '2 days',
    now()
  );

-- Insert bordereaux (supplier statements)
INSERT INTO bordereaux (
  id, organization_id, fournisseur_id, fichier_nom, fichier_url, 
  date_reception, periode_debut, periode_fin, nb_commissions_declarees, 
  statut_matching, notes, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'MMA',
    'bordereau_mma_q4_2024.pdf',
    'https://example.com/bordereaux/mma_q4.pdf',
    CURRENT_DATE - 15,
    CURRENT_DATE - 90,
    CURRENT_DATE - 1,
    12,
    'ok',
    'Bordereau T4 2024 - Tous les contrats rapprochés',
    now() - interval '15 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Generali',
    'bordereau_generali_novembre_2024.pdf',
    'https://example.com/bordereaux/generali_nov.pdf',
    CURRENT_DATE - 10,
    '2024-11-01',
    '2024-11-30',
    8,
    'ok',
    'Bordereau mensuel novembre',
    now() - interval '10 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'SwissLife',
    'bordereau_swisslife_q4_2024.pdf',
    'https://example.com/bordereaux/swisslife_q4.pdf',
    CURRENT_DATE - 5,
    CURRENT_DATE - 90,
    CURRENT_DATE - 1,
    15,
    'partiel',
    '13 sur 15 commissions rapprochées',
    now() - interval '5 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Axa',
    'bordereau_axa_decembre_2024.pdf',
    'https://example.com/bordereaux/axa_dec.pdf',
    CURRENT_DATE - 2,
    '2024-12-01',
    '2024-12-31',
    10,
    'a_verifier',
    'À traiter - nouvelles commissions',
    now() - interval '2 days',
    now()
  );
