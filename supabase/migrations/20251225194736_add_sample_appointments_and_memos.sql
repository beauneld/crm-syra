/*
  # Add Sample Appointments and Memos
  
  This migration adds:
  - Sample appointments linked to leads
  - Sample memos with various due dates and statuses
*/

-- Insert sample appointments
INSERT INTO appointments (
  id, organization_id, lead_id, user_id, title, description, 
  start_time, end_time, location, created_at, updated_at
)
VALUES
  -- Rendez-vous à venir
  (
    '40000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
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
    '10000000-0000-0000-0000-000000000004',
    'RDV Marc Leroy - Assurance Vie',
    'Détails sur les contrats d''assurance vie et avantages fiscaux',
    now() + interval '5 days' + interval '10 hours',
    now() + interval '5 days' + interval '11 hours',
    'Bureau Paris 8ème',
    now() - interval '1 day',
    now()
  ),
  -- Rendez-vous passés
  (
    '40000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    'RDV Thomas Petit - Conseil patrimonial',
    'Premier contact et analyse de la situation',
    now() - interval '10 days' + interval '15 hours',
    now() - interval '10 days' + interval '16 hours' + interval '30 minutes',
    'Bureau Bordeaux',
    now() - interval '15 days',
    now()
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002',
    'Signature contrat PER - Marie Moreau',
    'Finalisation et signature du contrat PER',
    now() - interval '5 days' + interval '14 hours',
    now() - interval '5 days' + interval '15 hours',
    'Visioconférence',
    now() - interval '10 days',
    now()
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000009',
    '10000000-0000-0000-0000-000000000002',
    'RDV Nathalie Fournier - Prévoyance',
    'Présentation solutions de prévoyance',
    now() - interval '10 days' + interval '16 hours',
    now() - interval '10 days' + interval '17 hours',
    'Visioconférence',
    now() - interval '15 days',
    now()
  );

-- Insert sample memos
INSERT INTO memos (
  id, organization_id, user_id, title, description, 
  due_date, due_time, status, created_at, updated_at
)
VALUES
  -- Mémos en retard
  (
    '50000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
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
    '10000000-0000-0000-0000-000000000002',
    'Relance dossier Thomas Petit',
    'Vérifier si Thomas a pris sa décision suite au RDV',
    CURRENT_DATE - 1,
    '10:00',
    'pending',
    now() - interval '3 days',
    now()
  ),
  -- Mémos du jour
  (
    '50000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Préparer présentation Sophie',
    'Finaliser la simulation PER pour le RDV de demain',
    CURRENT_DATE,
    '16:00',
    'pending',
    now() - interval '1 day',
    now()
  ),
  (
    '50000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000004',
    'Envoyer proposition Olivier Girard',
    'Transmettre la proposition d''assurance vie par email',
    CURRENT_DATE,
    '11:00',
    'pending',
    now(),
    now()
  ),
  -- Mémos à venir
  (
    '50000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Suivre contrat Marie Moreau',
    'Vérifier que tous les documents ont été transmis à l''assureur',
    CURRENT_DATE + 3,
    '09:00',
    'pending',
    now(),
    now()
  ),
  (
    '50000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Rappeler Julie Bernard',
    'Recontacter Julie comme convenu',
    CURRENT_DATE + 7,
    '15:00',
    'pending',
    now(),
    now()
  ),
  -- Mémos complétés
  (
    '50000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Envoyer devoir de conseil Marie',
    'Transmettre le devoir de conseil signé',
    CURRENT_DATE - 3,
    '14:00',
    'completed',
    now() - interval '5 days',
    now() - interval '2 days'
  ),
  (
    '50000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000004',
    'Préparer dossiers nouveaux leads',
    'Créer les fiches pour les leads de la nouvelle liste',
    CURRENT_DATE - 5,
    '10:00',
    'completed',
    now() - interval '7 days',
    now() - interval '4 days'
  );
