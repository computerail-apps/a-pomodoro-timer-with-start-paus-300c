import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { Flame, ListChecks, Coffee } from 'lucide-react';
import type { PomodoroSession } from '@/lib/sessions';

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function StatsCard({ sessions }: { sessions: PomodoroSession[] }) {
  const today = new Date();
  const todaysFocus = sessions.filter(
    (s) => s.session_type === 'focus' && isSameDay(new Date(s.completed_at), today)
  ).length;
  const todaysBreaks = sessions.filter(
    (s) => s.session_type === 'break' && isSameDay(new Date(s.completed_at), today)
  ).length;
  const totalFocus = sessions.filter((s) => s.session_type === 'focus').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your progress</CardTitle>
        <CardDescription>Synced across devices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-small text-muted-foreground">
            <Flame size={14} /> Today's focus sessions
          </span>
          <span className="text-h2 tabular-nums text-foreground">{todaysFocus}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-small text-muted-foreground">
            <Coffee size={14} /> Today's breaks
          </span>
          <span className="text-body tabular-nums text-foreground">{todaysBreaks}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="inline-flex items-center gap-2 text-small text-muted-foreground">
            <ListChecks size={14} /> All-time focus sessions
          </span>
          <span className="text-body tabular-nums text-foreground">{totalFocus}</span>
        </div>
      </CardContent>
    </Card>
  );
}
