export type SessionType = 'focus' | 'break';

export interface PomodoroSession {
  id: string;
  session_type: SessionType;
  duration_minutes: number;
  completed_at: string;
}

export const SESSIONS_KEY = ['pomodoro_sessions'];

function minutesAgoIso(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

export const mockSessions: PomodoroSession[] = [
  { id: 'seed-1', session_type: 'focus', duration_minutes: 25, completed_at: minutesAgoIso(35) },
  { id: 'seed-2', session_type: 'break', duration_minutes: 5, completed_at: minutesAgoIso(65) },
  { id: 'seed-3', session_type: 'focus', duration_minutes: 25, completed_at: minutesAgoIso(95) },
  { id: 'seed-4', session_type: 'break', duration_minutes: 5, completed_at: minutesAgoIso(125) },
  { id: 'seed-5', session_type: 'focus', duration_minutes: 25, completed_at: minutesAgoIso(160) },
  { id: 'seed-6', session_type: 'focus', duration_minutes: 25, completed_at: minutesAgoIso(60 * 5) },
  { id: 'seed-7', session_type: 'break', duration_minutes: 5, completed_at: minutesAgoIso(60 * 5 + 30) },
  { id: 'seed-8', session_type: 'focus', duration_minutes: 25, completed_at: minutesAgoIso(60 * 24 + 40) },
  { id: 'seed-9', session_type: 'break', duration_minutes: 5, completed_at: minutesAgoIso(60 * 24 + 70) },
  { id: 'seed-10', session_type: 'focus', duration_minutes: 25, completed_at: minutesAgoIso(60 * 24 + 100) },
  { id: 'seed-11', session_type: 'focus', duration_minutes: 25, completed_at: minutesAgoIso(60 * 48 + 20) },
  { id: 'seed-12', session_type: 'break', duration_minutes: 5, completed_at: minutesAgoIso(60 * 48 + 50) },
];
