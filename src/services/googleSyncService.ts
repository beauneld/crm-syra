import { supabase } from '../lib/supabase';

export interface GoogleSyncStatus {
  id: string;
  user_id: string;
  gmail_connected: boolean;
  calendar_connected: boolean;
  sheets_connected: boolean;
  gmail_email: string | null;
  sheets_email: string | null;
  last_sync_at: string | null;
  sync_status: 'connected' | 'error' | 'disconnected';
  sync_error_message: string | null;
  created_at: string;
  updated_at: string;
}

export async function getGoogleSyncStatus(userId: string): Promise<GoogleSyncStatus | null> {
  const { data, error } = await supabase
    .from('google_sync')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching Google sync status:', error);
    return null;
  }

  return data;
}

export async function createGoogleSyncRecord(userId: string): Promise<GoogleSyncStatus> {
  const { data, error } = await supabase
    .from('google_sync')
    .insert({
      user_id: userId,
      gmail_connected: false,
      calendar_connected: false,
      sheets_connected: false,
      sync_status: 'disconnected',
    })
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création du statut de synchronisation: ${error.message}`);
  return data;
}

export async function updateGoogleSyncStatus(
  syncId: string,
  updates: {
    gmail_connected?: boolean;
    calendar_connected?: boolean;
    sheets_connected?: boolean;
    gmail_email?: string;
    sheets_email?: string;
    sync_status?: 'connected' | 'error' | 'disconnected';
    sync_error_message?: string | null;
    last_sync_at?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('google_sync')
    .update(updates)
    .eq('id', syncId);

  if (error) throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
}

export async function disconnectGoogleSync(syncId: string): Promise<void> {
  const { error } = await supabase
    .from('google_sync')
    .update({
      gmail_connected: false,
      calendar_connected: false,
      sheets_connected: false,
      gmail_email: null,
      sheets_email: null,
      access_token_encrypted: null,
      refresh_token_encrypted: null,
      sync_status: 'disconnected',
      sync_error_message: null,
    })
    .eq('id', syncId);

  if (error) throw new Error(`Erreur lors de la déconnexion: ${error.message}`);
}

export function initiateGoogleOAuth(): void {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.email',
  ].join(' ');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');

  window.location.href = authUrl.toString();
}

export async function handleGoogleOAuthCallback(code: string, userId: string): Promise<void> {
  console.log('OAuth callback with code:', code, 'for user:', userId);
  alert('La synchronisation Google sera implémentée dans la prochaine version. Pour le moment, cette fonctionnalité simule une connexion réussie.');

  const syncStatus = await getGoogleSyncStatus(userId);

  if (syncStatus) {
    await updateGoogleSyncStatus(syncStatus.id, {
      calendar_connected: true,
      sheets_connected: true,
      gmail_email: 'user@example.com',
      sheets_email: 'user@example.com',
      sync_status: 'connected',
      last_sync_at: new Date().toISOString(),
    });
  } else {
    await createGoogleSyncRecord(userId);
  }
}
