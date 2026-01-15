/*
  # Ajout de données de démonstration pour le CRM
  
  1. Données ajoutées
    - Mémos pour différents utilisateurs
    - Leads avec différents statuts
    - Rendez-vous associés aux leads
    - Documents dans la bibliothèque
    - Partenaires
    - Contrats
*/

-- =============================================
-- MEMOS
-- =============================================
DO $$
DECLARE
  user_moche uuid := (SELECT id FROM user_profiles WHERE email = 'moche.azran@bienviyance.com' LIMIT 1);
  user_ornella uuid := (SELECT id FROM user_profiles WHERE email = 'ornella.attard@bienviyance.com' LIMIT 1);
  user_michael uuid := (SELECT id FROM user_profiles WHERE email = 'michael.hazan@bienviyance.com' LIMIT 1);
  user_philippine uuid := (SELECT id FROM user_profiles WHERE email = 'philippine.bachelier@bienviyance.com' LIMIT 1);
BEGIN
  IF user_moche IS NOT NULL THEN
    INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status, created_at)
    VALUES
      ('default', user_moche, 'Rappeler client Dupont', 'Suite RDV du 15/11 - Proposition PER', '2025-11-25', '14:00', 'pending', now() - interval '5 days'),
      ('default', user_moche, 'Envoyer devis Assurance Vie', 'Client Martin - Comparatif 3 assureurs', '2025-11-27', '10:30', 'pending', now() - interval '3 days'),
      ('default', user_moche, 'Préparer dossier signature', 'RDV Benjamin Zaoui - Contrat Macif', '2025-11-28', '16:00', 'pending', now() - interval '1 day'),
      ('default', user_moche, 'Relance prospect Leroy', 'Proposition non signée - Relancer', '2025-11-29', '09:00', 'pending', now()),
      ('default', user_moche, 'RDV préparation affaires nouvelles', 'Réunion équipe - Point mensuel', '2025-12-02', '14:00', 'pending', now()),
      ('default', user_moche, 'Formation nouveaux produits', 'Webinaire Generali - Nouveautés 2025', '2025-12-05', '10:00', 'pending', now())
    ON CONFLICT DO NOTHING;
  END IF;

  IF user_ornella IS NOT NULL THEN
    INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status, created_at)
    VALUES
      ('default', user_ornella, 'Appeler liste professions médicales', 'Nouvelle liste à traiter - 50 contacts', '2025-11-28', '11:00', 'pending', now()),
      ('default', user_ornella, 'Qualifier leads de la semaine', 'Préparer RDV pour conseillers', '2025-11-29', '15:30', 'pending', now())
    ON CONFLICT DO NOTHING;
  END IF;

  IF user_michael IS NOT NULL THEN
    INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status, created_at)
    VALUES
      ('default', user_michael, 'Valider contrats en attente', '5 dossiers à vérifier avant envoi', '2025-11-28', '10:00', 'pending', now()),
      ('default', user_michael, 'Mise à jour portefeuille clients', 'Export mensuel et statistiques', '2025-11-30', '09:30', 'pending', now())
    ON CONFLICT DO NOTHING;
  END IF;

  IF user_philippine IS NOT NULL THEN
    INSERT INTO memos (organization_id, user_id, title, description, due_date, due_time, status, created_at)
    VALUES
      ('default', user_philippine, 'Newsletter mensuelle', 'Préparer contenu décembre', '2025-11-29', '14:00', 'pending', now())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =============================================
-- LEADS
-- =============================================
DO $$
DECLARE
  user_moche uuid := (SELECT id FROM user_profiles WHERE email = 'moche.azran@bienviyance.com' LIMIT 1);
  user_ornella uuid := (SELECT id FROM user_profiles WHERE email = 'ornella.attard@bienviyance.com' LIMIT 1);
BEGIN
  IF user_moche IS NOT NULL THEN
    INSERT INTO leads (organization_id, user_id, first_name, last_name, phone, email, status, list_name, is_fake_number, worked_at, created_at, rdv_count)
    VALUES
      ('default', user_moche, 'Sophie', 'Martin', '0612345678', 'sophie.martin@example.com', 'signé', 'Professions médicales', false, now() - interval '10 days', now() - interval '15 days', 2),
      ('default', user_moche, 'Pierre', 'Dubois', '0623456789', 'pierre.dubois@example.com', 'rdv_pris', 'Nouveaux leads', false, now() - interval '5 days', now() - interval '12 days', 1),
      ('default', user_moche, 'Marie', 'Lefebvre', '0634567890', 'marie.lefebvre@example.com', 'travaillé', 'Professions libérales', false, now() - interval '3 days', now() - interval '8 days', 0),
      ('default', user_moche, 'Jean', 'Moreau', '0645678901', 'jean.moreau@example.com', 'nouveau', 'Tous les leads', false, null, now() - interval '2 days', 0),
      ('default', user_moche, 'Isabelle', 'Bernard', '0656789012', 'isabelle.bernard@example.com', 'perdu', 'Nouveaux leads', false, now() - interval '7 days', now() - interval '20 days', 0)
    ON CONFLICT DO NOTHING;
  END IF;

  IF user_ornella IS NOT NULL THEN
    INSERT INTO leads (organization_id, user_id, first_name, last_name, phone, email, status, list_name, is_fake_number, worked_at, created_at, rdv_count)
    VALUES
      ('default', user_ornella, 'Thomas', 'Petit', '0667890123', 'thomas.petit@example.com', 'travaillé', 'Professions médicales', false, now() - interval '4 days', now() - interval '9 days', 0),
      ('default', user_ornella, 'Julie', 'Roux', '0678901234', 'julie.roux@example.com', 'nouveau', 'Nouveaux leads', false, null, now() - interval '1 day', 0),
      ('default', user_ornella, 'Marc', 'Fournier', '0689012345', 'marc.fournier@example.com', 'rdv_pris', 'Professions libérales', false, now() - interval '6 days', now() - interval '11 days', 1),
      ('default', user_ornella, 'Claire', 'Girard', '0690123456', 'claire.girard@example.com', 'nouveau', 'Tous les leads', false, null, now(), 0),
      ('default', user_ornella, 'Laurent', 'Bonnet', '0601234567', 'laurent.bonnet@example.com', 'travaillé', 'Professions médicales', false, now() - interval '2 days', now() - interval '6 days', 0)
    ON CONFLICT DO NOTHING;
  END IF;

  INSERT INTO leads (organization_id, user_id, first_name, last_name, phone, email, status, list_name, is_fake_number, worked_at, created_at, rdv_count)
  VALUES
    ('default', null, 'Nathalie', 'Gauthier', '0612345098', 'nathalie.gauthier@example.com', 'nouveau', 'Tous les leads', false, null, now() - interval '3 hours', 0),
    ('default', null, 'Olivier', 'Lemoine', '0623456109', 'olivier.lemoine@example.com', 'nouveau', 'Nouveaux leads', false, null, now() - interval '5 hours', 0),
    ('default', null, 'Sylvie', 'Fontaine', '0634567210', 'sylvie.fontaine@example.com', 'nouveau', 'Professions libérales', false, null, now() - interval '1 hour', 0)
  ON CONFLICT DO NOTHING;
END $$;

-- =============================================
-- APPOINTMENTS
-- =============================================
DO $$
DECLARE
  user_moche uuid := (SELECT id FROM user_profiles WHERE email = 'moche.azran@bienviyance.com' LIMIT 1);
  user_ornella uuid := (SELECT id FROM user_profiles WHERE email = 'ornella.attard@bienviyance.com' LIMIT 1);
  lead_sophie uuid := (SELECT id FROM leads WHERE first_name = 'Sophie' AND last_name = 'Martin' LIMIT 1);
  lead_pierre uuid := (SELECT id FROM leads WHERE first_name = 'Pierre' AND last_name = 'Dubois' LIMIT 1);
  lead_marc uuid := (SELECT id FROM leads WHERE first_name = 'Marc' AND last_name = 'Fournier' LIMIT 1);
BEGIN
  IF lead_sophie IS NOT NULL AND user_moche IS NOT NULL THEN
    INSERT INTO appointments (lead_id, user_id, title, description, start_time, end_time, status, is_signed, created_at)
    VALUES
      (lead_sophie, user_moche, 'Consultation PER', 'Premier RDV - Présentation produits', now() - interval '10 days' + interval '14 hours', now() - interval '10 days' + interval '15 hours', 'complété', true, now() - interval '15 days'),
      (lead_sophie, user_moche, 'Signature contrat', 'Finalisation PER Macif', now() - interval '3 days' + interval '10 hours', now() - interval '3 days' + interval '11 hours', 'complété', true, now() - interval '5 days')
    ON CONFLICT DO NOTHING;
  END IF;

  IF lead_pierre IS NOT NULL AND user_moche IS NOT NULL THEN
    INSERT INTO appointments (lead_id, user_id, title, description, start_time, end_time, status, is_signed, created_at)
    VALUES
      (lead_pierre, user_moche, 'Étude patrimoniale', 'Analyse situation + proposition', now() + interval '2 days' + interval '15 hours', now() + interval '2 days' + interval '16 hours 30 minutes', 'planifié', false, now() - interval '5 days')
    ON CONFLICT DO NOTHING;
  END IF;

  IF lead_marc IS NOT NULL AND user_ornella IS NOT NULL THEN
    INSERT INTO appointments (lead_id, user_id, title, description, start_time, end_time, status, is_signed, created_at)
    VALUES
      (lead_marc, user_ornella, 'Découverte besoins', 'Premier contact client', now() + interval '1 day' + interval '11 hours', now() + interval '1 day' + interval '12 hours', 'confirmé', false, now() - interval '6 days')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =============================================
-- PARTNERS
-- =============================================
INSERT INTO partners (name, logo_url, website_url, created_at)
VALUES
  ('Generali', '/partner-logos/generali.png', 'https://www.generali.fr', now()),
  ('Macif', '/partner-logos/macif.png', 'https://www.macif.fr', now()),
  ('Swiss Life', '/partner-logos/swisslife.png', 'https://www.swisslife.fr', now()),
  ('Axa', '/partner-logos/axa.png', 'https://www.axa.fr', now()),
  ('Allianz', '/partner-logos/allianz.png', 'https://www.allianz.fr', now()),
  ('MMA', '/partner-logos/mma.png', 'https://www.mma.fr', now())
ON CONFLICT DO NOTHING;

-- =============================================
-- LIBRARY DOCUMENTS
-- =============================================
DO $$
DECLARE
  user_moche uuid := (SELECT id FROM user_profiles WHERE email = 'moche.azran@bienviyance.com' LIMIT 1);
BEGIN
  IF user_moche IS NOT NULL THEN
    INSERT INTO library_documents (organization_id, title, file_url, file_name, file_size, category, uploaded_by, created_at)
    VALUES
      ('default', 'Guide PER 2024', '/documents/guide-per-2024.pdf', 'guide-per-2024.pdf', 2456789, 'PER', user_moche, now() - interval '30 days'),
      ('default', 'Plaquette Generali PER', '/documents/generali-per.pdf', 'generali-per.pdf', 1234567, 'PER', user_moche, now() - interval '25 days'),
      ('default', 'Notice Macif PER Elite', '/documents/macif-per-elite.pdf', 'macif-per-elite.pdf', 3456789, 'PER', user_moche, now() - interval '20 days'),
      ('default', 'Comparatif Assurance Vie 2024', '/documents/comparatif-av-2024.pdf', 'comparatif-av-2024.pdf', 1876543, 'Assurance Vie', user_moche, now() - interval '15 days'),
      ('default', 'Swiss Life Patrimoine', '/documents/swisslife-patrimoine.pdf', 'swisslife-patrimoine.pdf', 2987654, 'Assurance Vie', user_moche, now() - interval '10 days'),
      ('default', 'Axa Premium Selection', '/documents/axa-premium.pdf', 'axa-premium.pdf', 2234567, 'Assurance Vie', user_moche, now() - interval '5 days')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =============================================
-- CONTRACTS
-- =============================================
DO $$
DECLARE
  lead_sophie uuid := (SELECT id FROM leads WHERE first_name = 'Sophie' AND last_name = 'Martin' LIMIT 1);
BEGIN
  INSERT INTO contracts (
    organization_id, lead_id, client_name, contract_type, amount, status,
    assureur, gamme_contrat, en_portefeuille, date_souscription,
    date_effet, montant_initial, versement_programme, periodicite, created_at
  )
  VALUES
    ('default', lead_sophie, 'Sophie Martin', 'PER', 15000, 'validated', 
     'Macif', 'PER Elite', true, now() - interval '3 days',
     now() - interval '2 days', 5000, 300, 'Mensuel', now() - interval '3 days'),
    
    ('default', null, 'Client Ancien 1', 'Assurance Vie', 50000, 'validated',
     'Generali', 'Premium', true, now() - interval '60 days',
     now() - interval '59 days', 50000, 0, 'Unique', now() - interval '60 days'),
    
    ('default', null, 'Client Ancien 2', 'PER', 25000, 'validated',
     'Swiss Life', 'Excellence', true, now() - interval '45 days',
     now() - interval '44 days', 10000, 500, 'Mensuel', now() - interval '45 days')
  ON CONFLICT DO NOTHING;
END $$;