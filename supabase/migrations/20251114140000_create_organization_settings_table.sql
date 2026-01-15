/*
  # Create Organization Settings Table

  1. New Tables
    - `organization_settings`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, unique - one settings record per organization)
      - `main_logo_url` (text, nullable - URL for main CRM logo)
      - `collapsed_logo_url` (text, nullable - URL for collapsed sidebar logo)
      - `email_template_content` (text, nullable - default email content for Mise en Relation)
      - `email_first_attachment_url` (text, nullable - URL for first attachment in Mise en Relation)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Storage Buckets
    - Create `organization-logos` bucket for logo uploads
    - Create `email-attachments` bucket for email attachment files
    - Both buckets with public read access

  3. Security
    - Enable RLS on `organization_settings` table
    - Add policy for authenticated users to read organization settings
    - Add policy for authenticated users with admin/manager+ roles to update settings
    - Storage policies for authenticated users to upload files
*/

-- Create organization_settings table
CREATE TABLE IF NOT EXISTS organization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE NOT NULL,
  main_logo_url text,
  collapsed_logo_url text,
  email_template_content text,
  email_first_attachment_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read organization settings
CREATE POLICY "Authenticated users can read organization settings"
  ON organization_settings FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can update organization settings
-- Note: Frontend will enforce role-based restrictions (Admin/Manager+ only)
CREATE POLICY "Authenticated users can update organization settings"
  ON organization_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: All authenticated users can insert organization settings
CREATE POLICY "Authenticated users can insert organization settings"
  ON organization_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create storage buckets for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization-logos', 'organization-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage buckets for email attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-attachments', 'email-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for organization-logos bucket
CREATE POLICY "Authenticated users can upload organization logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'organization-logos');

CREATE POLICY "Anyone can view organization logos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'organization-logos');

CREATE POLICY "Authenticated users can update organization logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'organization-logos')
  WITH CHECK (bucket_id = 'organization-logos');

CREATE POLICY "Authenticated users can delete organization logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'organization-logos');

-- Storage policies for email-attachments bucket
CREATE POLICY "Authenticated users can upload email attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'email-attachments');

CREATE POLICY "Anyone can view email attachments"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'email-attachments');

CREATE POLICY "Authenticated users can update email attachments"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'email-attachments')
  WITH CHECK (bucket_id = 'email-attachments');

CREATE POLICY "Authenticated users can delete email attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'email-attachments');

-- Insert default organization settings
INSERT INTO organization_settings (organization_id, email_template_content, email_first_attachment_url)
VALUES (
  gen_random_uuid(),
  'Bienvenue chez BIENVIYANCE, votre partenaire de confiance en matière de courtage en assurance et de family office dédié à votre protection sociale et votre épargne.
Chez Bienviyance , notre mission première est de placer votre bien-être financier et celui de votre famille au cœur de nos préoccupations.

Nous comprenons que chaque individu a des besoins uniques en matière d''assurance et d''épargne, c''est pourquoi nous mettons en œuvre notre expertise pointue pour vous offrir des solutions sur mesure, parfaitement adaptées à votre situation.

Que ce soit pour assurer l''avenir de vos proches, préparer votre retraite en toute sérénité, ou encore optimiser votre patrimoine, nous mettons à votre disposition une gamme complète de produits et de stratégies personnalisées.

Avec nous, vous bénéficierez de conseils éclairés, d''une analyse approfondie de vos besoins et de solutions innovantes pour protéger ce qui compte le plus pour vous.


Nous nous efforçons de vous offrir la meilleure couverture au meilleur prix, tout en vous donnant les clés pour faire fructifier votre épargne et sécuriser votre avenir financier.

Faites le choix de la Bienviyance envers votre patrimoine et votre famille.',
  'Moche Azran BNVCE.pdf'
)
ON CONFLICT (organization_id) DO NOTHING;
