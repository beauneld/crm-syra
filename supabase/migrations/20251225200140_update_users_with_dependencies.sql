/*
  # Update User Profiles with Dependencies
  
  This migration:
  - Deletes all dependent data
  - Updates user profiles with correct information
  - Re-adds sample data
*/

-- Delete all dependent data first
DELETE FROM lead_comments;
DELETE FROM appointments;
DELETE FROM library_documents;
DELETE FROM memos;
DELETE FROM leads;
DELETE FROM lists;

-- Delete and recreate user profiles
DELETE FROM user_profiles;

INSERT INTO user_profiles (id, organization_id, profile_type, first_name, last_name, email, photo_url, is_active, created_at, updated_at)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Admin',
    'Mandjé',
    'Lebel',
    'mandje.lebel@bienviyance.com',
    '/Mandje.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Gestion',
    'Michael',
    'Hazan',
    'michael.hazan@bienviyance.com',
    '/Michael.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Indicateur d''affaires',
    'Ornella',
    'Attard',
    'ornella.attard@bienviyance.com',
    '/Ornella.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Manager',
    'Moche',
    'Azran',
    'moche.azran@bienviyance.com',
    '/Moche.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Marketing',
    'Philippine',
    'Bachelier',
    'philippine.bachelier@bienviyance.com',
    '/Philippine.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Signataire',
    'Benjamin',
    'Zaoui',
    'benjamin.zaoui@bienviyance.com',
    '/Benjamin.jpg',
    true,
    now(),
    now()
  );

-- Re-insert sample lists
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

-- Re-insert sample leads with updated owners
INSERT INTO leads (
  id, organization_id, list_id, first_name, last_name, email, phone, 
  status, nrp_count, rdv_count, owner, owner_since, 
  imposition, birth_year, postal_code, city, profession, notes, 
  created_at, updated_at
)
VALUES
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
    'Moche Azran',
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
    'Ornella Attard',
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
    'Moche Azran',
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
    'Moche Azran',
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
    'Moche Azran',
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
    'Ornella Attard',
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
    'Moche Azran',
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
    'Ornella Attard',
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

-- Re-insert appointments
INSERT INTO appointments (
  id, organization_id, lead_id, user_id, title, description, 
  start_time, end_time, location, created_at, updated_at
)
VALUES
  (
    '40000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000004',
    'RDV Sophie Dubois - PER',
    'Présentation des solutions PER et simulation personnalisée',
    now() + interval '3 days' + interval '14 hours',
    now() + interval '3 days' + interval '15 hours',
    'Visioconférence',
    now() - interval '2 days',
    now()
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000003',
    'RDV Marc Leroy - Assurance Vie',
    'Détails sur les contrats d''assurance vie et avantages fiscaux',
    now() + interval '5 days' + interval '10 hours',
    now() + interval '5 days' + interval '11 hours',
    'Bureau Paris 8ème',
    now() - interval '1 day',
    now()
  );

-- Re-insert memos
INSERT INTO memos (
  id, organization_id, user_id, title, description, 
  due_date, due_time, status, created_at, updated_at
)
VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000004',
    'Rappeler Marc Leroy',
    'Faire un point sur les documents reçus pour l''assurance vie',
    CURRENT_DATE - 2,
    '14:00',
    'pending',
    now() - interval '5 days',
    now()
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000004',
    'Préparer présentation Sophie',
    'Finaliser la simulation PER pour le RDV de demain',
    CURRENT_DATE,
    '16:00',
    'pending',
    now() - interval '1 day',
    now()
  );

-- Re-insert library documents
INSERT INTO library_documents (
  id, organization_id, title, file_url, file_name, file_size, 
  category, sub_category, uploaded_by, uploaded_at, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Notice d''information PER Generali',
    'https://example.com/per-generali-notice.pdf',
    'per-generali-notice.pdf',
    2458000,
    'Contrats',
    'PER',
    '10000000-0000-0000-0000-000000000001',
    now() - interval '60 days',
    now() - interval '60 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Plaquette commerciale Bienviyance 2024',
    'https://example.com/bienviyance-plaquette.pdf',
    'bienviyance-plaquette.pdf',
    5680000,
    'Bienviyance',
    NULL,
    '10000000-0000-0000-0000-000000000001',
    now() - interval '90 days',
    now() - interval '90 days',
    now()
  );
