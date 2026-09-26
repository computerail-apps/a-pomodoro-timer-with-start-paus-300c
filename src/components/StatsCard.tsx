import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/Card';
import { Spinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { RotateCcw } from 'lucide-react';
import { fetchSessions, deleteAllSessions, isToday, SESSIONS_KEY } from '@/lib/sessions';

export function StatsCard() {
  const qc = useQueryClient();
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: fetchSessions,
  });

  const todaysFocus = data?.filter((s) => s.session_type === 'focus' && isToday(s.completed_at)).length ?? 0;
  const totalFocus = data?.filter((s) => s.session_type === 'focus').length ?? 0;
  const totalSessions = data?.length ?? 0;

  const handleReset = async () => {
    setResetting(true);
    setResetError(null);
    try {
      await deleteAllSessions();
      qc.invalidateQueries({ queryKey: SESSIONS_KEY });
    } catch (e) {
      setResetError((e as Error).message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-small">
            <Spinner size={16} /> Loading stats
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load stats</AlertTitle>
            <AlertDescription>{(error as Error).message}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-small text-muted-foreground">Session count</span>
              <div className="flex items-center gap-2">
                <span className="text-h3 tabular-nums text-foreground">{totalSessions}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  loading={resetting}
                  aria-label="Reset session count to zero"
                  className="h-7 px-2"
                >
                  <RotateCcw size={14} />
                </Button>
              </div>
            </div>
            <Row label="Today's focus sessions" value={todaysFocus} />
            <Row label="All-time focus sessions" value={totalFocus} />
            {resetError && (
              <Alert variant="destructive">
                <AlertTitle>Couldn't reset</AlertTitle>
                <AlertDescription>{resetError}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-small text-muted-foreground">{label}</span>
      <span className="text-h3 tabular-nums text-foreground">{value}</span>
    </div>
  );
}
