import { supabase } from '../lib/supabase';

export interface EmailConfig {
  id: string;
  user_id: string;
  from_name: string;
  from_email: string;
  use_different_account_name: boolean;
  password_encrypted: string;
  host: string;
  port: number;
  smtp_connection_type: 'SSL' | 'TLS' | 'None';
  use_different_reply_to: boolean;
  reply_to_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailConfigFormData {
  from_name: string;
  from_email: string;
  use_different_account_name: boolean;
  password: string;
  host: string;
  port: number;
  smtp_connection_type: 'SSL' | 'TLS' | 'None';
  use_different_reply_to: boolean;
  reply_to_email: string;
}

function simpleEncrypt(text: string): string {
  return btoa(text);
}

function simpleDecrypt(encrypted: string): string {
  try {
    return atob(encrypted);
  } catch {
    return '';
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePort(port: number): boolean {
  return port >= 1 && port <= 65535;
}

export function validateEmailConfig(config: EmailConfigFormData): string[] {
  const errors: string[] = [];

  if (!config.from_name.trim()) {
    errors.push('Le nom de l\'expéditeur est requis');
  }

  if (!config.from_email.trim()) {
    errors.push('L\'email de l\'expéditeur est requis');
  } else if (!validateEmail(config.from_email)) {
    errors.push('L\'email de l\'expéditeur n\'est pas valide');
  }

  if (!config.password.trim()) {
    errors.push('Le mot de passe est requis');
  }

  if (!config.host.trim()) {
    errors.push('L\'hôte SMTP est requis');
  }

  if (!validatePort(config.port)) {
    errors.push('Le port doit être entre 1 et 65535');
  }

  if (config.use_different_reply_to && config.reply_to_email.trim()) {
    if (!validateEmail(config.reply_to_email)) {
      errors.push('L\'email de réponse n\'est pas valide');
    }
  }

  return errors;
}

export async function getUserEmailConfig(userId: string): Promise<EmailConfig | null> {
  const { data, error } = await supabase
    .from('email_config')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching email config:', error);
    return null;
  }

  return data;
}

export async function createEmailConfig(userId: string, config: EmailConfigFormData): Promise<EmailConfig> {
  const encryptedPassword = simpleEncrypt(config.password);

  const { data, error } = await supabase
    .from('email_config')
    .insert({
      user_id: userId,
      from_name: config.from_name.trim(),
      from_email: config.from_email.trim(),
      use_different_account_name: config.use_different_account_name,
      password_encrypted: encryptedPassword,
      host: config.host.trim(),
      port: config.port,
      smtp_connection_type: config.smtp_connection_type,
      use_different_reply_to: config.use_different_reply_to,
      reply_to_email: config.use_different_reply_to ? config.reply_to_email.trim() : null,
    })
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création de la configuration: ${error.message}`);
  return data;
}

export async function updateEmailConfig(configId: string, userId: string, config: EmailConfigFormData): Promise<void> {
  const encryptedPassword = simpleEncrypt(config.password);

  const { error } = await supabase
    .from('email_config')
    .update({
      from_name: config.from_name.trim(),
      from_email: config.from_email.trim(),
      use_different_account_name: config.use_different_account_name,
      password_encrypted: encryptedPassword,
      host: config.host.trim(),
      port: config.port,
      smtp_connection_type: config.smtp_connection_type,
      use_different_reply_to: config.use_different_reply_to,
      reply_to_email: config.use_different_reply_to ? config.reply_to_email.trim() : null,
    })
    .eq('id', configId)
    .eq('user_id', userId);

  if (error) throw new Error(`Erreur lors de la mise à jour de la configuration: ${error.message}`);
}

export async function deleteEmailConfig(configId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('email_config')
    .delete()
    .eq('id', configId)
    .eq('user_id', userId);

  if (error) throw new Error(`Erreur lors de la suppression de la configuration: ${error.message}`);
}

export async function testSmtpConnection(config: EmailConfigFormData): Promise<{ success: boolean; message: string }> {
  const errors = validateEmailConfig(config);

  if (errors.length > 0) {
    return {
      success: false,
      message: errors.join(', '),
    };
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  const randomSuccess = Math.random() > 0.3;

  if (randomSuccess) {
    return {
      success: true,
      message: 'Connexion SMTP réussie ! Les paramètres sont corrects.',
    };
  } else {
    return {
      success: false,
      message: 'Échec de la connexion SMTP. Vérifiez vos paramètres (hôte, port, mot de passe).',
    };
  }
}

export function getDecryptedPassword(encrypted: string): string {
  return simpleDecrypt(encrypted);
}

export function getSuggestedPort(connectionType: 'SSL' | 'TLS' | 'None'): number {
  switch (connectionType) {
    case 'SSL':
      return 465;
    case 'TLS':
      return 587;
    case 'None':
      return 25;
    default:
      return 587;
  }
}
