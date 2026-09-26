import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/Card';
import { Spinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { fetchSessions, isToday, SESSIONS_KEY } from '@/lib/sessions';

export function StatsCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: fetchSessions,
  });

  const todaysFocus = data?.filter((s) => s.session_type === 'focus' && isToday(s.completed_at)).length ?? 0;
  const totalFocus = data?.filter((s) => s.session_type === 'focus').length ?? 0;

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
            <Row label="Today's focus sessions" value={todaysFocus} />
            <Row label="All-time focus sessions" value={totalFocus} />
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
