'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

type ScoreEntry = {
  id: string;
  playerName: string;
  score: number;
  createdAt: Timestamp;
};

const prizeDistribution: { [key: number]: number } = {
  1: 0.30, // 30%
  2: 0.20, // 20%
  3: 0.10, // 10%
  4: 0.05, // 5%
};

function LeaderboardSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </div>
    );
}

export default function LeaderboardTable() {
  const firestore = useFirestore();
  const [totalEntries, setTotalEntries] = useState(0);
  const [week, setWeek] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    const today = new Date();
    // Week starts on Monday and ends on Sunday at midnight.
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    setWeek({ start, end });
  }, []);

  const scoresQuery = useMemoFirebase(() => {
    if (!firestore || !week) return null;
    // Query is simplified to avoid composite index. Sorting and limiting is done client-side.
    return query(
        collection(firestore, 'scores'), 
        where('createdAt', '>=', week.start),
        where('createdAt', '<=', week.end)
    );
  }, [firestore, week]);

  const { data: allScores, loading, error } = useCollection<ScoreEntry>(scoresQuery);
  
  const scores = useMemo(() => {
    if (!allScores) return null;
    return [...allScores]
      .sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score; // Higher score first
        }
        // Tie-breaker: earlier time first
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      })
      .slice(0, 10);
  }, [allScores]);

  useEffect(() => {
    if (!firestore || !week) return;
    
    const scoresCol = collection(firestore, 'scores');
    const q = query(scoresCol, where('createdAt', '>=', week.start), where('createdAt', '<=', week.end));

    const unsubscribe = onSnapshot(q, snapshot => {
        setTotalEntries(snapshot.size);
    });

    return () => unsubscribe();
  }, [firestore, week]);

  const getPrizePercentage = (rank: number) => {
    const percentage = prizeDistribution[rank];
    if (percentage) {
      return `${(percentage * 100)}%`;
    }
    return '–';
  };

  const getRankIcon = (rank: number) => {
    const iconBaseClass = "flex items-center justify-center h-7 w-7 rounded-md font-bold text-lg";
    if (rank <= 4) {
        return <div className={`${iconBaseClass} bg-primary text-primary-foreground`}>{rank}</div>;
    }
    return <div className="flex items-center justify-center h-7 w-7">{rank}</div>;
  };

  return (
    <Card className="border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Weekly Leaderboard</CardTitle>
        <CardDescription>
          {week ? `Top 10 players for ${format(week.start, 'MMM d')} – ${format(week.end, 'MMM d, yyyy')}` : 'Top 10 players of the week.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <LeaderboardSkeleton />}
        {error && (
          <div className="text-center text-destructive p-4 border border-destructive/50 bg-destructive/10 rounded-md">
            <p className="font-bold">Could not load leaderboard.</p>
            <p className="text-sm mt-2">
                This feature requires a database configuration. A link to create it may have been printed in your browser's developer console. Please open the console, click the link, and then refresh this page.
            </p>
          </div>
        )}
        {scores && !loading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Prize Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score, index) => (
                <TableRow key={score.id} className={index < 4 ? 'font-bold' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell>{score.playerName}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{getPrizePercentage(index + 1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
