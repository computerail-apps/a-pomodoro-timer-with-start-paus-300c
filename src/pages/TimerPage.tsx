import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppData } from '@/lib/data';
import { Card, CardContent } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { Button } from '@/lib/ui/Button';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SESSIONS_KEY, mockSessions, type PomodoroSession } from '@/lib/sessions';
import { StatsCard } from '@/components/StatsCard';

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function TimerPage() {
  const qc = useQueryClient();
  const { data: sessions, isLoading, error, refetch } = useAppData<PomodoroSession[]>({
    key: SESSIONS_KEY,
    mock: mockSessions,
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  function completeSession(justFinishedType: 'focus' | 'break') {
    const completed: PomodoroSession = {
      id: crypto.randomUUID(),
      session_type: justFinishedType,
      duration_minutes: justFinishedType === 'focus' ? 25 : 5,
      completed_at: new Date().toISOString(),
    };
    qc.setQueryData<PomodoroSession[]>(SESSIONS_KEY, (old) => [completed, ...(old ?? [])]);
    const next = justFinishedType === 'focus' ? 'break' : 'focus';
    setSessionType(next);
    setSecondsLeft(next === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
  }

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          completeSession(sessionType);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, sessionType]);

  function handleStart() {
    setIsRunning(true);
  }
  function handlePause() {
    setIsRunning(false);
  }
  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(sessionType === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
  }

  const total = sessionType === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
  const progressPct = Math.min(100, Math.round(((total - secondsLeft) / total) * 100));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-foreground">Focus timer</h1>
        <p className="text-body text-muted-foreground">
          25 minutes of focus, 5 minutes to breathe. Your progress is saved automatically.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <Card className="animate-in">
            <CardContent className="flex flex-col items-center gap-8 py-16">
              <Badge variant={sessionType === 'focus' ? 'default' : 'outline'}>
                {sessionType === 'focus' ? 'Focus' : 'Break'}
              </Badge>
              <div className="text-display font-bold tabular-nums tracking-tight text-foreground">
                {formatTime(secondsLeft)}
              </div>
              <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 ease-out',
                    sessionType === 'focus' ? 'bg-primary' : 'bg-accent'
                  )}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={handleStart} disabled={isRunning}>
                  <Play size={16} />
                  Start
                </Button>
                <Button variant="secondary" onClick={handlePause} disabled={!isRunning}>
                  <Pause size={16} />
                  Pause
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  <RotateCcw size={16} />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="md:col-span-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <CenteredSpinner label="Loading stats" />
              </CardContent>
            </Card>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn't load stats</AlertTitle>
              <AlertDescription>
                {(error as Error).message}
                <div className="mt-3">
                  <Button size="sm" variant="outline" onClick={() => refetch()}>
                    Retry
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <StatsCard sessions={sessions ?? []} />
          )}
        </aside>
      </div>
    </div>
  );
}
