/*
  # Sample Data for Devoir de Conseil Module
  
  ## Adds
  - 5 devoirs de conseil with complete client information
  - Multiple contracts per conseil (some have 1, some have 2-3 contracts)
  - Mixed statuses: 'Non signé', 'Signé'
  - Realistic French insurance data
  
  ## Notes
  - Uses existing user_profiles as signataires
  - Demonstrates multi-contract capability
  - Provides variety of insurance types
*/

-- First, clear any existing sample data
DELETE FROM devoir_conseil_contrats WHERE devoir_conseil_id IN (
  SELECT id FROM devoirs_conseil WHERE client_name IN ('Serge Del Vall', 'Sophie Martin', 'Thomas Dubois', 'Marie Lefebvre', 'Jean Dupont')
);

DELETE FROM devoirs_conseil WHERE client_name IN ('Serge Del Vall', 'Sophie Martin', 'Thomas Dubois', 'Marie Lefebvre', 'Jean Dupont');

-- Insert 5 devoirs de conseil
INSERT INTO devoirs_conseil (
  id,
  client_name,
  civilite,
  nom,
  prenom,
  telephone,
  email,
  adresse,
  ville,
  code_postal,
  date_naissance,
  statut_professionnel,
  profession,
  besoins,
  risques,
  budget,
  situation_familiale,
  situation_professionnelle,
  projets,
  autres_remarques,
  produits_proposes,
  garanties,
  exclusions,
  limites,
  conditions,
  options,
  montants_garantie,
  adequation_confirmee,
  risques_refus,
  signature_client,
  date_signature,
  status,
  signataire_id,
  user_id,
  created_at
) VALUES
-- 1. Serge Del Vall - Signé avec 3 contrats
(
  '10000000-0000-0000-0000-000000000001',
  'Serge Del Vall',
  'M.',
  'Del Vall',
  'Serge',
  '0620847919',
  'delvallepaton.sergie@gmail.com',
  '1 IMP JACOB INSEL',
  'TOULOUSE',
  '31200',
  '1985-01-01',
  'TNS',
  'Consultant IT',
  'Protection santé complète pour la famille, prévoyance et épargne retraite',
  'Risques médicaux liés à des antécédents familiaux, absence de couverture prévoyance',
  '450€/mois',
  'Marié, 2 enfants',
  'Consultant indépendant dans le secteur IT',
  'Achat résidence secondaire dans 2 ans, préparation retraite',
  'Souhaite une franchise faible et des garanties étendues',
  'Assurance Santé Premium, Prévoyance TNS, PER Individuel',
  'Hospitalisation 100%, Soins dentaires 200%, Optique 300€/an, ITT, IPT, Décès',
  'Cures thermales non remboursées, sports extrêmes',
  'Plafond annuel: 50000€',
  'Franchise annuelle: 50€, Délai de carence: 3 mois pour prévoyance',
  'Option Assistance 24/7, Garantie des accidents de la vie',
  'Hospitalisation: illimité, Dentaire: 1500€/an, Capital décès: 300000€',
  true,
  'Sans ces couvertures, les frais d''hospitalisation et les conséquences d''une incapacité de travail seraient à charge complète',
  'Serge Del Vall',
  '2025-11-01',
  'Signé',
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '2025-11-06T09:00:00Z'
),
-- 2. Sophie Martin - Signé avec 2 contrats
(
  '10000000-0000-0000-0000-000000000002',
  'Sophie Martin',
  'Mme',
  'Martin',
  'Sophie',
  '0612345678',
  'sophie.martin@outlook.fr',
  '45 Avenue de la République',
  'PARIS',
  '75011',
  '1982-05-20',
  'Salarié',
  'Cadre supérieur',
  'Assurance emprunteur et assurance vie pour investissement',
  'Crédit immobilier en cours, besoin de sécuriser le patrimoine',
  '320€/mois',
  'Mariée, 2 enfants',
  'Cadre supérieur dans le secteur bancaire',
  'Investissement locatif, constitution d''un patrimoine',
  'Recherche des solutions d''épargne fiscalement avantageuses',
  'Assurance Emprunteur, Assurance Vie multisupport',
  'Décès, PTIA, ITT, IPT, Garantie des accidents de la vie',
  'Sports dangereux non couverts',
  'Capital garanti à 100% pendant 24 mois',
  'Franchise 90 jours pour ITT',
  'Garantie des maladies non objectivables',
  'Capital décès: 500000€, Rente ITT: 2500€/mois',
  true,
  'En cas de décès ou d''incapacité, le crédit immobilier resterait à charge du conjoint',
  'Sophie Martin',
  '2025-09-15',
  'Signé',
  '44444444-4444-4444-4444-444444444444',
  '44444444-4444-4444-4444-444444444444',
  '2025-10-05T09:36:50Z'
),
-- 3. Thomas Dubois - Non signé avec 1 contrat
(
  '10000000-0000-0000-0000-000000000003',
  'Thomas Dubois',
  'M.',
  'Dubois',
  'Thomas',
  '0698765432',
  'thomas.dubois@gmail.com',
  '12 Rue des Entrepreneurs',
  'LYON',
  '69002',
  '1990-08-15',
  'TNS',
  'Entrepreneur digital',
  'Assurance habitation pour appartement de 85m²',
  'Appartement au 4ème étage, zone à risque cambriolage modéré',
  '42€/mois',
  'Célibataire',
  'Entrepreneur dans le digital',
  'Expansion de son activité professionnelle',
  'Matériel informatique de valeur au domicile (15000€)',
  'Habitation Confort, Habitation Premium',
  'Responsabilité civile, Vol et vandalisme, Dégâts des eaux, Incendie',
  'Catastrophes naturelles non déclarées',
  'Franchise 150€ par sinistre',
  'Délai de déclaration sinistre: 5 jours ouvrés',
  'Extension garantie matériel informatique professionnel',
  'Capital mobilier: 30000€, Matériel pro: 15000€',
  true,
  'Sans assurance habitation, tout sinistre serait à sa charge complète',
  'Thomas Dubois',
  '2026-01-13',
  'Non signé',
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '2025-10-05T09:36:50Z'
),
-- 4. Marie Lefebvre - Signé avec 2 contrats
(
  '10000000-0000-0000-0000-000000000004',
  'Marie Lefebvre',
  'Mme',
  'Lefebvre',
  'Marie',
  '0623456789',
  'marie.lefebvre@avocat-conseil.fr',
  '78 Boulevard Haussmann',
  'PARIS',
  '75008',
  '1985-03-12',
  'Profession libérale',
  'Avocate',
  'Assurance auto tous risques et assurance responsabilité civile professionnelle',
  'Véhicule haut de gamme nécessitant une protection complète, risques professionnels',
  '180€/mois',
  'Mariée, 1 enfant',
  'Avocate spécialisée en droit des affaires',
  'Changement de véhicule tous les 3 ans via leasing',
  'Véhicule utilisé quotidiennement (20000 km/an)',
  'Auto Tous Risques Premium, RC Pro Avocat',
  'Tous risques collision, Vol incendie, Bris de glace, Défense pénale et recours',
  'Conduite hors permis valide, Usage compétition',
  'Franchise 0€ si garage agréé, Plafond RC Pro: 5000000€',
  'Assistance 0km, Véhicule de remplacement',
  'Extension Garantie Conducteur à 1000000€, Protection juridique étendue',
  'Dommages tous accidents: valeur véhicule, RC Pro: 5M€',
  true,
  'Sans garantie tous risques, tout accident responsable serait à charge. Sans RC Pro, risque financier majeur en cas de mise en cause',
  'Marie Lefebvre',
  '2025-09-28',
  'Signé',
  '44444444-4444-4444-4444-444444444444',
  '44444444-4444-4444-4444-444444444444',
  '2025-10-05T09:36:50Z'
),
-- 5. Jean Dupont - Non signé avec 2 contrats
(
  '10000000-0000-0000-0000-000000000005',
  'Jean Dupont',
  'M.',
  'Dupont',
  'Jean',
  '0645789123',
  'jean.dupont@entreprise.fr',
  '23 Rue de la Liberté',
  'MARSEILLE',
  '13001',
  '1978-11-30',
  'TNS',
  'Artisan Plombier',
  'Protection prévoyance TNS et assurance décennale',
  'Absence de couverture prévoyance, obligation légale décennale',
  '280€/mois',
  'Marié, 3 enfants',
  'Artisan plombier, entreprise individuelle',
  'Embauche d''un apprenti dans 6 mois',
  'Souhaite une protection complète de son activité et sa famille',
  'Prévoyance TNS Renforcée, Assurance Décennale Artisan',
  'ITT, IPT, Invalidité, Décès, Garantie dommages ouvrage',
  'Arrêt de travail inférieur à 3 jours',
  'Franchise 90 jours ITT, Garantie décennale: 10 ans après réception',
  'Indemnités journalières après franchise',
  'Maintien de revenu 100%, Double effet',
  'Rente ITT: 3000€/mois, Capital décès: 400000€, Garantie décennale: 1500000€',
  true,
  'Sans prévoyance, arrêt de l''activité en cas d''accident. Sans décennale, impossibilité légale de travailler',
  'Jean Dupont',
  '2026-01-13',
  'Non signé',
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '2026-01-10T14:30:00Z'
);

-- Insert multiple contracts for each devoir de conseil

-- Contracts for Serge Del Vall (3 contracts)
INSERT INTO devoir_conseil_contrats (
  devoir_conseil_id,
  contrat_type,
  contrat_nom,
  garanties,
  exclusions,
  limites,
  conditions,
  options,
  montants_garantie
) VALUES
(
  '10000000-0000-0000-0000-000000000001',
  'Santé',
  'Assurance Santé Famille Plus - Formule Or',
  'Hospitalisation 100%, Soins dentaires 200%, Optique 300€/an, Médecine douce 150€/an',
  'Cures thermales non remboursées',
  'Plafond annuel: 50000€',
  'Franchise annuelle: 50€',
  'Option Assistance 24/7',
  'Hospitalisation: illimité, Dentaire: 1500€/an, Optique: 300€/an'
),
(
  '10000000-0000-0000-0000-000000000001',
  'Prévoyance',
  'Prévoyance TNS - Protection Complète',
  'ITT: 100% du revenu, IPT: Rente viagère, Décès: Capital + Rente éducation',
  'Arrêts maladie < 7 jours',
  'Délai de carence: 3 mois',
  'Franchise 90 jours pour ITT',
  'Garantie des maladies non objectivables',
  'Rente ITT: 3000€/mois, Capital décès: 300000€, Rente éducation: 500€/mois par enfant'
),
(
  '10000000-0000-0000-0000-000000000001',
  'Retraite',
  'PER Individuel - Formule Équilibre',
  'Versements déductibles, Gestion pilotée, Garantie plancher',
  'Déblocage anticipé limité aux cas légaux',
  'Frais de gestion: 0.85%/an',
  'Versements libres ou programmés',
  'Option sortie en capital partielle',
  'Versement initial: 10000€, Versements mensuels: 200€'
);

-- Contracts for Sophie Martin (2 contracts)
INSERT INTO devoir_conseil_contrats (
  devoir_conseil_id,
  contrat_type,
  contrat_nom,
  garanties,
  exclusions,
  limites,
  conditions,
  options,
  montants_garantie
) VALUES
(
  '10000000-0000-0000-0000-000000000002',
  'Emprunteur',
  'Assurance Emprunteur Premium - Crédit Immobilier',
  'Décès, PTIA, ITT, IPT à 100%, Garantie des accidents de la vie',
  'Sports dangereux non couverts, Affections préexistantes',
  'Capital garanti: montant du prêt',
  'Franchise 90 jours pour ITT',
  'Garantie des maladies non objectivables, Prise en charge du dos et psy',
  'Capital décès: 500000€, Rente ITT: 2500€/mois'
),
(
  '10000000-0000-0000-0000-000000000002',
  'Épargne',
  'Assurance Vie Multisupport - Horizon Patrimoine',
  'Support euros garantis, Unités de compte variées, Gestion libre ou sous mandat',
  'Aucune garantie en capital sur UC',
  'Frais entrée: 0%, Frais gestion: 0.75%/an',
  'Versements libres, Disponibilité totale après 8 ans',
  'Gestion pilotée selon profil, Option arbitrages automatiques',
  'Versement initial: 50000€, Garantie capital: 100% sur fonds euros'
);

-- Contract for Thomas Dubois (1 contract)
INSERT INTO devoir_conseil_contrats (
  devoir_conseil_id,
  contrat_type,
  contrat_nom,
  garanties,
  exclusions,
  limites,
  conditions,
  options,
  montants_garantie
) VALUES
(
  '10000000-0000-0000-0000-000000000003',
  'Habitation',
  'Habitation Premium avec option Matériel Professionnel',
  'Responsabilité civile, Vol et vandalisme, Dégâts des eaux, Incendie, Bris de glace',
  'Catastrophes naturelles non déclarées par arrêté',
  'Franchise 150€ par sinistre, 380€ pour catastrophes naturelles',
  'Délai de déclaration sinistre: 5 jours ouvrés, 10 jours pour vol',
  'Extension garantie matériel informatique professionnel, Protection juridique',
  'Capital mobilier: 30000€, Matériel professionnel: 15000€, RC: 10000000€'
);

-- Contracts for Marie Lefebvre (2 contracts)
INSERT INTO devoir_conseil_contrats (
  devoir_conseil_id,
  contrat_type,
  contrat_nom,
  garanties,
  exclusions,
  limites,
  conditions,
  options,
  montants_garantie
) VALUES
(
  '10000000-0000-0000-0000-000000000004',
  'Auto',
  'Auto Tous Risques Premium - Valeur à Neuf 24 mois',
  'Tous risques collision, Vol incendie, Bris de glace, Dommages tous accidents',
  'Conduite hors permis valide, Usage compétition',
  'Franchise 0€ si garage agréé, 300€ sinon',
  'Assistance 0km, Véhicule de remplacement catégorie supérieure',
  'Extension Garantie Conducteur à 1000000€, Protection du bonus',
  'Dommages: valeur véhicule à neuf pendant 24 mois, RC: 100000000€'
),
(
  '10000000-0000-0000-0000-000000000004',
  'RC Professionnelle',
  'RC Professionnelle Avocat - Protection Intégrale',
  'Défense pénale et recours, Dommages corporels et matériels, Atteinte à l''image',
  'Fautes intentionnelles, Amendes pénales',
  'Plafond par sinistre: 5000000€, Plafond annuel: 10000000€',
  'Assistance juridique 24/7, Prise en charge des frais de défense',
  'Protection juridique étendue, Garantie antérieure acquise',
  'Plafond RC: 5000000€ par sinistre, Franchise: 1000€'
);

-- Contracts for Jean Dupont (2 contracts)
INSERT INTO devoir_conseil_contrats (
  devoir_conseil_id,
  contrat_type,
  contrat_nom,
  garanties,
  exclusions,
  limites,
  conditions,
  options,
  montants_garantie
) VALUES
(
  '10000000-0000-0000-0000-000000000005',
  'Prévoyance',
  'Prévoyance TNS Renforcée - Artisan',
  'ITT: Maintien de revenu 100%, IPT: Rente viagère, Invalidité totale, Décès',
  'Arrêt de travail < 3 jours, Maladies psychiques',
  'Délai de carence: 90 jours',
  'Franchise 90 jours ITT, Indemnités journalières après franchise',
  'Maintien de revenu 100%, Double effet (indemnités + SS)',
  'Rente ITT: 3000€/mois, Rente IPP: 2500€/mois, Capital décès: 400000€'
),
(
  '10000000-0000-0000-0000-000000000005',
  'Responsabilité Décennale',
  'Assurance Décennale Artisan Plombier',
  'Garantie dommages ouvrage, Vices et malfaçons, Responsabilité après réception',
  'Dommages esthétiques seuls, Travaux non conformes aux règles de l''art',
  'Garantie décennale: 10 ans après réception des travaux',
  'Déclaration obligatoire de tous les chantiers > 50000€',
  'Extension garantie biennale, Protection juridique',
  'Garantie décennale: 1500000€ par sinistre, Franchise: 1500€'
);