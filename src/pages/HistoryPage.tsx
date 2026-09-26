import { useAppData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { History as HistoryIcon } from 'lucide-react';
import { SESSIONS_KEY, mockSessions, type PomodoroSession } from '@/lib/sessions';

export default function HistoryPage() {
  const { data, isLoading, error, refetch } = useAppData<PomodoroSession[]>({
    key: SESSIONS_KEY,
    mock: mockSessions,
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const sorted = [...(data ?? [])].sort(
    (a, b) => Date.parse(b.completed_at) - Date.parse(a.completed_at)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-foreground">Session history</h1>
        <p className="text-body text-muted-foreground">
          Every completed focus and break session, synced from your account.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Completed sessions</CardTitle>
          <CardDescription>{sorted.length} total</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12">
              <CenteredSpinner label="Loading history" />
            </div>
          ) : error ? (
            <div className="px-6 pb-6">
              <Alert variant="destructive">
                <AlertTitle>Couldn't load history</AlertTitle>
                <AlertDescription>
                  {(error as Error).message}
                  <div className="mt-3">
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                      Retry
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          ) : sorted.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={<HistoryIcon size={20} />}
                title="No sessions yet"
                description="Complete a focus session on the timer to see it appear here."
              />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {sorted.map((s) => (
                <li key={s.id} className="flex items-center gap-4 px-6 py-3">
                  <Badge variant={s.session_type === 'focus' ? 'default' : 'outline'}>
                    {s.session_type === 'focus' ? 'Focus' : 'Break'}
                  </Badge>
                  <span className="text-small text-muted-foreground">{s.duration_minutes} min</span>
                  <span className="ml-auto text-small tabular-nums text-muted-foreground">
                    {new Date(s.completed_at).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
