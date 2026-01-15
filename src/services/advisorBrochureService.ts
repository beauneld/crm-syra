import { supabase } from '../lib/supabase';

export async function uploadAdvisorBrochure(file: File, userId: string): Promise<string> {
  if (file.type !== 'application/pdf') {
    throw new Error('Seuls les fichiers PDF sont autorisés');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('La taille du fichier ne doit pas dépasser 10MB');
  }

  const fileExt = 'pdf';
  const fileName = `advisor-brochure-${userId}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('advisor-brochures')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Échec de l'upload de la plaquette: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('advisor-brochures')
    .getPublicUrl(filePath);

  return fileName;
}

export async function deleteAdvisorBrochure(fileName: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('advisor-brochures')
      .remove([fileName]);

    if (error) {
      console.error('Failed to delete advisor brochure:', error);
    }
  } catch (error) {
    console.error('Failed to delete advisor brochure:', error);
  }
}

export function getAdvisorBrochureUrl(fileName: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from('advisor-brochures')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function updateUserBrochure(userId: string, fileName: string | null): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .update({
      advisor_brochure_url: fileName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Échec de la mise à jour de la plaquette: ${error.message}`);
  }
}
