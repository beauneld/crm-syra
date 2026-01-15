/*
  # Ajout de données massives pour correspondre au screenshot
  
  1. Plus de profils utilisateurs (10 au total)
  2. 100 leads répartis entre les utilisateurs
  3. 20 appointments
  4. Plus de mémos
  5. Signataires disponibilités
  6. Contrats
*/

-- =============================================
-- AJOUTER DES PROFILS UTILISATEURS SUPPLÉMENTAIRES
-- =============================================
INSERT INTO user_profiles (profile_type, first_name, last_name, email, is_active, photo_url)
VALUES
  ('Manager', 'Sophie', 'Dubois', 'sophie.dubois@bienviyance.com', false, '/Ornella.jpg'),
  ('Gestion', 'Lucas', 'Moreau', 'lucas.moreau@bienviyance.com', false, '/Benjamin.jpg'),
  ('Indicateur d''affaires', 'Emma', 'Laurent', 'emma.laurent@bienviyance.com', false, '/Philippine.jpg'),
  ('Marketing', 'Thomas', 'Bernard', 'thomas.bernard@bienviyance.com', false, '/Michael.jpg')
ON CONFLICT DO NOTHING;

-- =============================================
-- AJOUTER PLUS DE MÉMOS
-- =============================================
DO $$
DECLARE
  user_ids uuid[] := ARRAY(SELECT id FROM user_profiles ORDER BY created_at LIMIT 8);
  i integer;
BEGIN
  INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status, created_at)
  VALUES
    (
      'default',
      user_ids[2],
      'Suivi dossier Leblanc',
      'Vérifier documents reçus',
      CURRENT_DATE + 1,
      '11:30',
      'pending',
      now() - interval '1 day'
    )
  ON CONFLICT DO NOTHING;
END $$;

-- =============================================
-- AJOUTER 87 LEADS SUPPLÉMENTAIRES POUR ATTEINDRE 100
-- =============================================
DO $$
DECLARE
  user_ids uuid[] := ARRAY(SELECT id FROM user_profiles ORDER BY created_at LIMIT 8);
  statuses text[] := ARRAY['nouveau', 'travaillé', 'rdv_pris', 'signé', 'perdu'];
  lists text[] := ARRAY['Professions médicales', 'Nouveaux leads', 'Professions libérales', 'Tous les leads', 'Artisans', 'Dirigeants'];
  i integer;
  random_status text;
  random_list text;
  random_user uuid;
BEGIN
  FOR i IN 14..100 LOOP
    random_status := statuses[1 + floor(random() * 5)::int];
    random_list := lists[1 + floor(random() * 6)::int];
    
    IF random() < 0.7 THEN
      random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
    ELSE
      random_user := NULL;
    END IF;

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
      created_at,
      rdv_count
    )
    VALUES (
      'default',
      random_user,
      'Client' || i,
      'Test' || i,
      '06' || LPAD((10000000 + i)::text, 8, '0'),
      'client' || i || '@example.com',
      random_status,
      random_list,
      (random() < 0.1),
      CASE 
        WHEN random_status != 'nouveau' THEN now() - (random() * interval '30 days')
        ELSE NULL
      END,
      now() - (random() * interval '45 days'),
      CASE
        WHEN random_status = 'rdv_pris' THEN 1
        WHEN random_status = 'signé' THEN floor(1 + random() * 3)::int
        ELSE 0
      END
    );
  END LOOP;
END $$;

-- =============================================
-- AJOUTER 16 APPOINTMENTS SUPPLÉMENTAIRES POUR ATTEINDRE 20
-- =============================================
DO $$
DECLARE
  user_ids uuid[] := ARRAY(SELECT id FROM user_profiles ORDER BY created_at LIMIT 8);
  lead_ids uuid[] := ARRAY(SELECT id FROM leads WHERE status IN ('rdv_pris', 'signé') LIMIT 20);
  i integer;
  random_lead uuid;
  random_user uuid;
  random_date timestamptz;
BEGIN
  FOR i IN 5..20 LOOP
    random_lead := lead_ids[1 + floor(random() * LEAST(array_length(lead_ids, 1), 20))::int];
    random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
    
    IF random() < 0.5 THEN
      random_date := now() + (random() * interval '14 days');
    ELSE
      random_date := now() - (random() * interval '30 days');
    END IF;

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
    )
    VALUES (
      random_lead,
      random_user,
      'RDV Client ' || i,
      'Consultation ' || CASE 
        WHEN random() < 0.5 THEN 'PER'
        ELSE 'Assurance Vie'
      END,
      random_date + interval '10 hours',
      random_date + interval '11 hours',
      CASE
        WHEN random_date < now() THEN 'complété'
        WHEN random() < 0.3 THEN 'confirmé'
        ELSE 'planifié'
      END,
      (random() < 0.2),
      random_date - interval '2 days'
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- =============================================
-- AJOUTER DISPONIBILITÉS SIGNATAIRES
-- =============================================
DO $$
DECLARE
  signataire_id uuid := (SELECT id FROM user_profiles WHERE profile_type = 'Signataire' LIMIT 1);
BEGIN
  IF signataire_id IS NOT NULL THEN
    INSERT INTO signataire_disponibilites (signataire_id, appointment_date, start_time, end_time, status, created_at)
    VALUES
      (signataire_id, CURRENT_DATE + 2, '09:00', '10:00', 'occupied', now()),
      (signataire_id, CURRENT_DATE + 3, '14:00', '15:00', 'occupied', now())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =============================================
-- AJOUTER PLUS DE CONTRATS
-- =============================================
DO $$
DECLARE
  signed_leads uuid[] := ARRAY(SELECT id FROM leads WHERE status = 'signé' LIMIT 10);
  i integer;
  assureurs text[] := ARRAY['Generali', 'Macif', 'Swiss Life', 'Axa', 'Allianz', 'MMA'];
  types text[] := ARRAY['PER', 'Assurance Vie', 'Prévoyance', 'Santé'];
BEGIN
  FOR i IN 1..10 LOOP
    IF i <= array_length(signed_leads, 1) THEN
      INSERT INTO contracts (
        organization_id,
        lead_id,
        client_name,
        contract_type,
        amount,
        status,
        assureur,
        gamme_contrat,
        en_portefeuille,
        date_souscription,
        date_effet,
        montant_initial,
        versement_programme,
        periodicite,
        created_at
      )
      VALUES (
        'default',
        signed_leads[i],
        'Client Signé ' || i,
        types[1 + floor(random() * 4)::int],
        10000 + (random() * 90000)::numeric,
        CASE
          WHEN random() < 0.8 THEN 'validated'
          ELSE 'in_review'
        END,
        assureurs[1 + floor(random() * 6)::int],
        'Premium',
        true,
        now() - (random() * interval '60 days'),
        now() - (random() * interval '55 days'),
        5000 + (random() * 45000)::numeric,
        200 + (random() * 800)::numeric,
        CASE
          WHEN random() < 0.7 THEN 'Mensuel'
          WHEN random() < 0.9 THEN 'Trimestriel'
          ELSE 'Annuel'
        END,
        now() - (random() * interval '65 days')
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;