import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { History } from 'lucide-react';
import { fetchSessions, SESSIONS_KEY } from '@/lib/sessions';

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function HistoryPage() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: fetchSessions,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session history</CardTitle>
        <CardDescription>Every completed focus and break session, most recent first.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-12">
            <CenteredSpinner label="Loading sessions" />
          </div>
        ) : error ? (
          <div className="space-y-4 px-6 pb-6">
            <Alert variant="destructive">
              <AlertTitle>Couldn't load history</AlertTitle>
              <AlertDescription>{(error as Error).message}</AlertDescription>
            </Alert>
            <button
              className="text-small text-muted-foreground underline"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              {isRefetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState
              icon={<History size={20} />}
              title="No sessions yet"
              description="Complete a focus or break session on the Timer page to see it here."
            />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-6 py-3">
                <Badge variant={s.session_type === 'focus' ? 'default' : 'outline'}>
                  {s.session_type === 'focus' ? 'Focus' : 'Break'}
                </Badge>
                <span className="text-small tabular-nums text-muted-foreground">
                  {s.duration_minutes} min
                </span>
                <span className="ml-auto text-small tabular-nums text-muted-foreground">
                  {formatTimestamp(s.completed_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
