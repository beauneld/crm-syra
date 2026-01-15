/*
  # Add Contracts to Email Signature Devoirs
  
  ## Changes
  
  Add contracts (devoir_conseil_contrats) for each of the 5 sample
  devoirs with "Signature par email" status to demonstrate the contracts
  management system.
*/

-- First, get the IDs of the recently created devoirs conseil
WITH devoirs_ids AS (
  SELECT id, client_name FROM devoirs_conseil 
  WHERE status = 'Signature par email' 
  AND client_name IN ('Sophie Martin', 'Jean Dupont', 'Marie Leclerc', 'Pierre Bernard', 'Claire Rousseau')
  ORDER BY created_at DESC
  LIMIT 5
)
INSERT INTO devoir_conseil_contrats (
  devoir_conseil_id,
  contrat_type,
  contrat_nom,
  garanties,
  exclusions,
  limites,
  conditions,
  options,
  montants_garantie,
  created_at,
  updated_at
)
SELECT 
  d.id,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'PER'
    WHEN d.client_name = 'Jean Dupont' THEN 'Prévoyance'
    WHEN d.client_name = 'Marie Leclerc' THEN 'PER'
    WHEN d.client_name = 'Pierre Bernard' THEN 'PER'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Assurance Vie'
  END,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'PER Retraite Plus'
    WHEN d.client_name = 'Jean Dupont' THEN 'Prévoyance Cadre Pro'
    WHEN d.client_name = 'Marie Leclerc' THEN 'PER Indépendants'
    WHEN d.client_name = 'Pierre Bernard' THEN 'PER Signature'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Assurance Vie Prestige'
  END,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'Couverture complète décès et invalidité, Rente retraite garantie'
    WHEN d.client_name = 'Jean Dupont' THEN 'Indemnité décès 500k€, Rente invalidité'
    WHEN d.client_name = 'Marie Leclerc' THEN 'Couverture retraite renforcée, Garanties sociales'
    WHEN d.client_name = 'Pierre Bernard' THEN 'Couverture épargne retraite, Protection famille'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Couverture famille complète, Transmission de capital'
  END,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'Exclusions médicales standard'
    WHEN d.client_name = 'Jean Dupont' THEN 'Exclusions sport extrême'
    WHEN d.client_name = 'Marie Leclerc' THEN 'Exclusions standard'
    WHEN d.client_name = 'Pierre Bernard' THEN 'Aucune'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Exclusions juridiques'
  END,
  'Limites standard',
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'Conditions standard'
    WHEN d.client_name = 'Jean Dupont' THEN 'Conditions favorables'
    WHEN d.client_name = 'Marie Leclerc' THEN 'Conditions favorables indépendants'
    WHEN d.client_name = 'Pierre Bernard' THEN 'Conditions attractives'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Conditions standard'
  END,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'Options complémentaires'
    WHEN d.client_name = 'Jean Dupont' THEN 'Options santé premium'
    WHEN d.client_name = 'Marie Leclerc' THEN 'Options retraite progressive'
    WHEN d.client_name = 'Pierre Bernard' THEN 'Versement initial 10k€'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Gestion pilotée'
  END,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN '500000'
    WHEN d.client_name = 'Jean Dupont' THEN '600000'
    WHEN d.client_name = 'Marie Leclerc' THEN '400000'
    WHEN d.client_name = 'Pierre Bernard' THEN '300000'
    WHEN d.client_name = 'Claire Rousseau' THEN '750000'
  END,
  now(),
  now()
FROM devoirs_ids d;

-- Add a second contract for some clients
WITH devoirs_ids AS (
  SELECT id, client_name FROM devoirs_conseil 
  WHERE status = 'Signature par email' 
  AND client_name IN ('Sophie Martin', 'Claire Rousseau')
  ORDER BY created_at DESC
  LIMIT 2
)
INSERT INTO devoir_conseil_contrats (
  devoir_conseil_id,
  contrat_type,
  contrat_nom,
  garanties,
  exclusions,
  limites,
  conditions,
  options,
  montants_garantie,
  created_at,
  updated_at
)
SELECT 
  d.id,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'Assurance Vie'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Prévoyance'
  END,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'Assurance Vie Dynamique'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Prévoyance Famille'
  END,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'Couverture décès et invalidité, Fonds en euros'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Couverture décès, Indemnités accident'
  END,
  'Exclusions standard',
  'Limites standard',
  'Conditions standard',
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN 'Investissements variés'
    WHEN d.client_name = 'Claire Rousseau' THEN 'Options enfants'
  END,
  CASE 
    WHEN d.client_name = 'Sophie Martin' THEN '250000'
    WHEN d.client_name = 'Claire Rousseau' THEN '500000'
  END,
  now(),
  now()
FROM devoirs_ids d;
