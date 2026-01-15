import { supabase } from '../lib/supabase';
import { UserSession, UserDailyActivity, ActivityStats } from '../types';

export const startSession = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert([
        {
          user_id: userId,
          session_start: new Date().toISOString(),
          user_agent: navigator.userAgent,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    if (data) {
      localStorage.setItem('current_session_id', data.id);
      await updateDailyActivity(userId);
      return data.id;
    }

    return null;
  } catch (error) {
    console.error('Error starting session:', error);
    return null;
  }
};

export const endSession = async (sessionId: string): Promise<void> => {
  try {
    const { data: session, error: fetchError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError) throw fetchError;

    const sessionEnd = new Date();
    const sessionStart = new Date(session.session_start);
    const durationSeconds = Math.floor((sessionEnd.getTime() - sessionStart.getTime()) / 1000);

    const { error } = await supabase
      .from('user_sessions')
      .update({
        session_end: sessionEnd.toISOString(),
        duration_seconds: durationSeconds,
      })
      .eq('id', sessionId);

    if (error) throw error;

    await updateDailyActivity(session.user_id);
    localStorage.removeItem('current_session_id');
  } catch (error) {
    console.error('Error ending session:', error);
  }
};

export const updateHeartbeat = async (sessionId: string): Promise<void> => {
  try {
    const { data: session, error: fetchError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError) throw fetchError;

    const now = new Date();
    const sessionStart = new Date(session.session_start);
    const durationSeconds = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);

    const { error } = await supabase
      .from('user_sessions')
      .update({
        duration_seconds: durationSeconds,
      })
      .eq('id', sessionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating heartbeat:', error);
  }
};

const updateDailyActivity = async (userId: string): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: sessions, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('session_start', `${today}T00:00:00`)
      .lte('session_start', `${today}T23:59:59`);

    if (sessionsError) throw sessionsError;

    if (!sessions || sessions.length === 0) return;

    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const sessionCount = sessions.length;
    const firstLogin = sessions.sort(
      (a, b) => new Date(a.session_start).getTime() - new Date(b.session_start).getTime()
    )[0].session_start;
    const lastLogout = sessions
      .filter((s) => s.session_end)
      .sort((a, b) => new Date(b.session_end!).getTime() - new Date(a.session_end!).getTime())[0]
      ?.session_end;

    const { error: upsertError } = await supabase.from('user_activity_daily').upsert(
      {
        user_id: userId,
        activity_date: today,
        total_duration_seconds: totalDuration,
        session_count: sessionCount,
        first_login: firstLogin,
        last_logout: lastLogout || null,
      },
      {
        onConflict: 'user_id,activity_date',
      }
    );

    if (upsertError) throw upsertError;
  } catch (error) {
    console.error('Error updating daily activity:', error);
  }
};

export const getUserDailyActivity = async (
  userId: string,
  year: number,
  month: number
): Promise<UserDailyActivity[]> => {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('user_activity_daily')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', startDate)
      .lte('activity_date', endDate)
      .order('activity_date', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching daily activity:', error);
    return [];
  }
};

export const getMonthlyStats = async (
  userId: string,
  year: number,
  month: number
): Promise<ActivityStats> => {
  try {
    const activities = await getUserDailyActivity(userId, year, month);

    const totalSeconds = activities.reduce((sum, a) => sum + a.total_duration_seconds, 0);
    const totalHours = totalSeconds / 3600;
    const activeDays = activities.length;
    const averageHoursPerDay = activeDays > 0 ? totalHours / activeDays : 0;
    const totalSessions = activities.reduce((sum, a) => sum + a.session_count, 0);

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      activeDays,
      averageHoursPerDay: Math.round(averageHoursPerDay * 10) / 10,
      totalSessions,
    };
  } catch (error) {
    console.error('Error calculating monthly stats:', error);
    return {
      totalHours: 0,
      activeDays: 0,
      averageHoursPerDay: 0,
      totalSessions: 0,
    };
  }
};

export const getLastLoginDate = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('session_start')
      .eq('user_id', userId)
      .order('session_start', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return data?.session_start || null;
  } catch (error) {
    console.error('Error fetching last login:', error);
    return null;
  }
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}min`;
  }

  return `${hours}h ${minutes}min`;
};
