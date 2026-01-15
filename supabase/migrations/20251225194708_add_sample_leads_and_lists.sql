/*
  # Add Sample Leads and Lists
  
  This migration adds:
  - Sample lead lists (imported and manual)
  - Sample leads with various statuses
  - Lead comments
*/

-- Insert sample lists
INSERT INTO lists (id, organization_id, name, type, lead_count, created_at, updated_at)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Liste Import Décembre 2024',
    'importés',
    150,
    now() - interval '30 days',
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Prospects Salon Épargne Paris',
    'manuels',
    45,
    now() - interval '15 days',
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Liste Import Novembre 2024',
    'importés',
    200,
    now() - interval '60 days',
    now()
  );

-- Insert sample leads
INSERT INTO leads (
  id, organization_id, list_id, first_name, last_name, email, phone, 
  status, nrp_count, rdv_count, owner, owner_since, 
  imposition, birth_year, postal_code, city, profession, notes, 
  created_at, updated_at
)
VALUES
  -- RDV pris
  (
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Sophie',
    'Dubois',
    'sophie.dubois@email.fr',
    '0612345678',
    'RDV pris',
    0,
    1,
    'Philippine Dupont',
    now() - interval '5 days',
    'TMI 30%',
    1985,
    '75008',
    'Paris',
    'Cadre commercial',
    'Intéressée par un PER pour optimiser sa fiscalité',
    now() - interval '10 days',
    now()
  ),
  -- Intéressé
  (
    '30000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Marc',
    'Leroy',
    'marc.leroy@email.fr',
    '0623456789',
    'Intéressé',
    1,
    0,
    'Mandje Laurent',
    now() - interval '3 days',
    'TMI 41%',
    1978,
    '92100',
    'Boulogne-Billancourt',
    'Directeur financier',
    'A besoin de plus d''informations sur l''assurance vie',
    now() - interval '7 days',
    now()
  ),
  -- À rappeler
  (
    '30000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Julie',
    'Bernard',
    'julie.bernard@email.fr',
    '0634567890',
    'À rappeler',
    2,
    0,
    'Philippine Dupont',
    now() - interval '2 days',
    'TMI 30%',
    1990,
    '69001',
    'Lyon',
    'Ingénieure',
    'Demande à être rappelée la semaine prochaine',
    now() - interval '12 days',
    now()
  ),
  -- RDV honoré
  (
    '30000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Thomas',
    'Petit',
    'thomas.petit@email.fr',
    '0645678901',
    'RDV honoré',
    0,
    1,
    'Philippine Dupont',
    now() - interval '15 days',
    'TMI 45%',
    1975,
    '33000',
    'Bordeaux',
    'Chef d''entreprise',
    'RDV effectué le 10/12, en réflexion sur PER et prévoyance',
    now() - interval '20 days',
    now()
  ),
  -- Signé
  (
    '30000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Marie',
    'Moreau',
    'marie.moreau@email.fr',
    '0656789012',
    'Signé',
    0,
    1,
    'Philippine Dupont',
    now() - interval '25 days',
    'TMI 41%',
    1982,
    '75016',
    'Paris',
    'Médecin',
    'Contrat PER signé pour 500€/mois',
    now() - interval '30 days',
    now()
  ),
  -- NRP
  (
    '30000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'Pierre',
    'Simon',
    'pierre.simon@email.fr',
    '0667890123',
    'NRP',
    3,
    0,
    'Mandje Laurent',
    now() - interval '8 days',
    NULL,
    1988,
    '13001',
    'Marseille',
    'Commercial',
    '3 tentatives sans réponse',
    now() - interval '14 days',
    now()
  ),
  -- Pas intéressé
  (
    '30000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'Isabelle',
    'Laurent',
    'isabelle.laurent@email.fr',
    '0678901234',
    'Pas intéressé',
    0,
    0,
    NULL,
    NULL,
    NULL,
    1995,
    '59000',
    'Lille',
    'Étudiante',
    'Pas de budget actuellement',
    now() - interval '5 days',
    now()
  ),
  -- Sans statut
  (
    '30000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'François',
    'Roux',
    'francois.roux@email.fr',
    '0689012345',
    'Sans statut',
    0,
    0,
    NULL,
    NULL,
    'TMI 30%',
    1987,
    '31000',
    'Toulouse',
    'Avocat',
    NULL,
    now() - interval '2 days',
    now()
  ),
  -- RDV manqué
  (
    '30000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Nathalie',
    'Fournier',
    'nathalie.fournier@email.fr',
    '0690123456',
    'RDV manqué',
    0,
    1,
    'Philippine Dupont',
    now() - interval '4 days',
    'TMI 30%',
    1992,
    '44000',
    'Nantes',
    'Infirmière',
    'N''est pas venue au RDV du 15/12',
    now() - interval '10 days',
    now()
  ),
  -- Intéressé
  (
    '30000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Olivier',
    'Girard',
    'olivier.girard@email.fr',
    '0601234567',
    'Intéressé',
    1,
    0,
    'Mandje Laurent',
    now() - interval '1 day',
    'TMI 41%',
    1980,
    '67000',
    'Strasbourg',
    'Pharmacien',
    'Souhaite diversifier son épargne',
    now() - interval '3 days',
    now()
  );

-- Insert sample lead comments
INSERT INTO lead_comments (lead_id, user_id, content, created_at)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Premier contact très positif. Sophie est réceptive aux solutions PER.',
    now() - interval '5 days'
  ),
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'RDV fixé pour le 28 décembre à 14h00.',
    now() - interval '2 days'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000004',
    'Marc souhaite comparer plusieurs offres avant de prendre sa décision.',
    now() - interval '3 days'
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    'RDV très productif. Thomas est en phase de réflexion.',
    now() - interval '10 days'
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002',
    'Signature effectuée ! Contrat PER avec versements mensuels de 500€.',
    now() - interval '5 days'
  );
