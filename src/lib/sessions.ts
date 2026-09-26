import { supabase } from '@/lib/supabase';

export type SessionType = 'focus' | 'break';

export interface PomodoroSession {
  id: string;
  session_type: SessionType;
  duration_minutes: number;
  completed_at: string;
}

const TABLE = 'a_pomodoro_timer_wit_pomodoro_sessions';

export const SESSIONS_KEY = ['pomodoro_sessions'];

export async function fetchSessions(): Promise<PomodoroSession[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id,session_type,duration_minutes,completed_at')
    .order('completed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PomodoroSession[];
}

export async function logSession(sessionType: SessionType, durationMinutes: number): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  const payload: Record<string, unknown> = {
    session_type: sessionType,
    duration_minutes: durationMinutes,
    completed_at: new Date().toISOString(),
  };
  if (userId) payload.user_id = userId;
  const { error } = await supabase.from(TABLE).insert(payload);
  if (error) throw error;
}

export async function deleteAllSessions(): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().not('id', 'is', null);
  if (error) throw error;
}

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
