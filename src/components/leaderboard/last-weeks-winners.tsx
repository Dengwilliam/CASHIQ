'use client';

import { useMemo } from 'react';
import { subWeeks, startOfWeek, endOfWeek, format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown } from 'lucide-react';
import { useLeaderboardScores } from '@/hooks/useLeaderboardScores';

function WinnersSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4 ml-auto" />
                </div>
            ))}
        </div>
    );
}

export default function LastWeeksWinners() {
  const lastWeek = useMemo(() => {
    const today = new Date();
    const lastWeekDate = subWeeks(today, 1);
    const start = startOfWeek(lastWeekDate, { weekStartsOn: 1 });
    const end = endOfWeek(lastWeekDate, { weekStartsOn: 1 });
    return { start, end };
  }, []);

  const { rankedScores, loading } = useLeaderboardScores(lastWeek);
  
  const winners = useMemo(() => {
    if (!rankedScores) return null;
    return rankedScores.slice(0, 4);
  }, [rankedScores]);

  const getRankIcon = (rank: number) => {
    const colors = ['text-yellow-400', 'text-slate-400', 'text-orange-400'];
    if (rank <= 3) {
        return <Crown className={`h-6 w-6 ${colors[rank-1]}`} />;
    }
    return <span className="font-bold text-lg">{rank}</span>;
  };

  if (!loading && (!winners || winners.length === 0)) {
    return null;
  }

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-accent/20 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Last Week's Champions</CardTitle>
        <CardDescription className="text-base">
          {`Winners for ${format(lastWeek.start, 'MMM d')} – ${format(lastWeek.end, 'MMM d')}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? <WinnersSkeleton /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-foreground/80 uppercase tracking-wider text-xs">Rank</TableHead>
                <TableHead className="text-foreground/80 uppercase tracking-wider text-xs">Player</TableHead>
                <TableHead className="text-right text-foreground/80 uppercase tracking-wider text-xs">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {winners && winners.map((winner) => (
                <TableRow key={winner.id} className="font-semibold">
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getRankIcon(winner.rank || 0)}
                    </div>
                  </TableCell>
                  <TableCell>{winner.playerName}</TableCell>
                  <TableCell className="text-right text-primary">{winner.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
