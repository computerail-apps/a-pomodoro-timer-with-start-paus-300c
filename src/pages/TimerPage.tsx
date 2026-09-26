import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/lib/ui/Card';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { logSession, SESSIONS_KEY, SessionType } from '@/lib/sessions';

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TimerPage() {
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const qc = useQueryClient();

  const totalForType = sessionType === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;

  const handleComplete = useCallback(async () => {
    setRunning(false);
    const completedType = sessionType;
    const completedDuration = completedType === 'focus' ? 25 : 5;
    try {
      setSaveError(null);
      await logSession(completedType, completedDuration);
      qc.invalidateQueries({ queryKey: SESSIONS_KEY });
    } catch (e) {
      setSaveError((e as Error).message);
    }
    const nextType: SessionType = completedType === 'focus' ? 'break' : 'focus';
    setSessionType(nextType);
    setSecondsLeft(nextType === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
  }, [sessionType, qc]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current ?? undefined);
          void handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, handleComplete]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setSecondsLeft(totalForType);
  };

  const progress = 1 - secondsLeft / totalForType;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="md:col-span-8">
        <Card className="animate-in">
          <CardContent className="flex flex-col items-center gap-8 py-16">
            <Badge variant={sessionType === 'focus' ? 'default' : 'outline'}>
              {sessionType === 'focus' ? 'Focus' : 'Break'}
            </Badge>
            <div
              className={
                'text-display tabular-nums transition-colors duration-150 ease-out ' +
                (sessionType === 'focus' ? 'text-foreground' : 'text-accent')
              }
            >
              {formatTime(secondsLeft)}
            </div>
            <div className="h-1 w-full max-w-sm overflow-hidden rounded-full bg-muted">
              <div
                className={
                  'h-full rounded-full transition-all duration-300 ease-out ' +
                  (sessionType === 'focus' ? 'bg-primary' : 'bg-accent')
                }
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!running ? (
                <Button onClick={start}>
                  <Play size={16} />
                  Start
                </Button>
              ) : (
                <Button onClick={pause} variant="secondary">
                  <Pause size={16} />
                  Pause
                </Button>
              )}
              <Button onClick={reset} variant="ghost">
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
            {saveError && (
              <Alert variant="destructive" className="max-w-sm">
                <AlertTitle>Couldn't save session</AlertTitle>
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <aside className="md:col-span-4">
        <StatsCard />
      </aside>
    </div>
  );
}
