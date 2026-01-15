/*
  # Add Sample Organization and Users
  
  This migration adds:
  - Main organization (Bienviyance)
  - Organization settings with logos
  - Sample user profiles with different roles
*/

-- Insert main organization
INSERT INTO organizations (id, name, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Bienviyance',
  now(),
  now()
);

-- Insert organization settings
INSERT INTO organization_settings (
  id,
  organization_id,
  logo_url,
  logo_dark_url,
  primary_color,
  secondary_color,
  company_name,
  address,
  phone,
  email,
  website,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  '/Bienviyance-logo-2.png',
  '/Bienviyance-logo-7.png',
  '#3b82f6',
  '#1e40af',
  'Bienviyance',
  '123 Avenue des Champs-Élysées, 75008 Paris',
  '+33 1 23 45 67 89',
  'contact@bienviyance.fr',
  'https://bienviyance.fr',
  now(),
  now()
);

-- Insert sample user profiles
INSERT INTO user_profiles (id, organization_id, profile_type, first_name, last_name, email, photo_url, is_active, created_at, updated_at)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Admin',
    'Benjamin',
    'Moché',
    'benjamin@bienviyance.fr',
    '/Benjamin.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Manager',
    'Philippine',
    'Dupont',
    'philippine@bienviyance.fr',
    '/Philippine.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Gestion',
    'Ornella',
    'Martin',
    'ornella@bienviyance.fr',
    '/Ornella.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Indicateur d''affaires',
    'Mandje',
    'Laurent',
    'mandje@bienviyance.fr',
    '/Mandje.jpg',
    true,
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Signataire',
    'Michael',
    'Bernard',
    'michael@bienviyance.fr',
    '/Michael.jpg',
    true,
    now(),
    now()
  );
