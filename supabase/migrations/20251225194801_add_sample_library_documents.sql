/*
  # Add Sample Library Documents
  
  This migration adds:
  - Sample documents in the library for Contrats (PER, Assurance Vie)
  - Sample documents in the library for Bienviyance materials
*/

-- Insert sample library documents
INSERT INTO library_documents (
  id, organization_id, title, file_url, file_name, file_size, 
  category, sub_category, uploaded_by, uploaded_at, created_at, updated_at
)
VALUES
  -- Contrats - PER
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
    'Conditions générales PER Axa',
    'https://example.com/per-axa-cg.pdf',
    'per-axa-cg.pdf',
    3125000,
    'Contrats',
    'PER',
    '10000000-0000-0000-0000-000000000001',
    now() - interval '55 days',
    now() - interval '55 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Brochure commerciale PER Spirica',
    'https://example.com/per-spirica-brochure.pdf',
    'per-spirica-brochure.pdf',
    1890000,
    'Contrats',
    'PER',
    '10000000-0000-0000-0000-000000000001',
    now() - interval '45 days',
    now() - interval '45 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Grille de frais PER Cardif',
    'https://example.com/per-cardif-frais.pdf',
    'per-cardif-frais.pdf',
    856000,
    'Contrats',
    'PER',
    '10000000-0000-0000-0000-000000000002',
    now() - interval '40 days',
    now() - interval '40 days',
    now()
  ),
  -- Contrats - Assurance Vie
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Notice Assurance Vie Suravenir',
    'https://example.com/av-suravenir-notice.pdf',
    'av-suravenir-notice.pdf',
    2890000,
    'Contrats',
    'Assurance Vie',
    '10000000-0000-0000-0000-000000000001',
    now() - interval '50 days',
    now() - interval '50 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Fonds disponibles Placement-Direct Vie',
    'https://example.com/av-placement-direct-fonds.pdf',
    'av-placement-direct-fonds.pdf',
    4250000,
    'Contrats',
    'Assurance Vie',
    '10000000-0000-0000-0000-000000000001',
    now() - interval '35 days',
    now() - interval '35 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Conditions générales Linxea Avenir',
    'https://example.com/av-linxea-cg.pdf',
    'av-linxea-cg.pdf',
    3456000,
    'Contrats',
    'Assurance Vie',
    '10000000-0000-0000-0000-000000000002',
    now() - interval '30 days',
    now() - interval '30 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Guide fiscal Assurance Vie 2024',
    'https://example.com/av-guide-fiscal.pdf',
    'av-guide-fiscal.pdf',
    1567000,
    'Contrats',
    'Assurance Vie',
    '10000000-0000-0000-0000-000000000001',
    now() - interval '20 days',
    now() - interval '20 days',
    now()
  ),
  -- Bienviyance
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
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Argumentaire commercial PER',
    'https://example.com/argumentaire-per.pdf',
    'argumentaire-per.pdf',
    1234000,
    'Bienviyance',
    NULL,
    '10000000-0000-0000-0000-000000000002',
    now() - interval '25 days',
    now() - interval '25 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Modèle devoir de conseil',
    'https://example.com/modele-devoir-conseil.docx',
    'modele-devoir-conseil.docx',
    456000,
    'Bienviyance',
    NULL,
    '10000000-0000-0000-0000-000000000001',
    now() - interval '70 days',
    now() - interval '70 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Charte graphique Bienviyance',
    'https://example.com/charte-graphique.pdf',
    'charte-graphique.pdf',
    8900000,
    'Bienviyance',
    NULL,
    '10000000-0000-0000-0000-000000000001',
    now() - interval '120 days',
    now() - interval '120 days',
    now()
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Script téléphonique qualification',
    'https://example.com/script-telephone.pdf',
    'script-telephone.pdf',
    678000,
    'Bienviyance',
    NULL,
    '10000000-0000-0000-0000-000000000004',
    now() - interval '15 days',
    now() - interval '15 days',
    now()
  );
