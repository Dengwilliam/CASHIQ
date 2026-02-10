'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Award, Medal, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type ScoreEntry = {
  id: string;
  playerName: string;
  score: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

const ENTRY_FEE = 25000;

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
    return query(
        collection(firestore, 'scores'), 
        where('createdAt', '>=', week.start),
        where('createdAt', '<=', week.end),
        orderBy('score', 'desc'),
        limit(10)
    );
  }, [firestore, week]);

  const { data: scores, loading, error } = useCollection<ScoreEntry>(scoresQuery);

  useEffect(() => {
    if (!firestore || !week) return;
    
    const scoresCol = collection(firestore, 'scores');
    const q = query(scoresCol, where('createdAt', '>=', week.start), where('createdAt', '<=', week.end));

    const unsubscribe = onSnapshot(q, snapshot => {
        setTotalEntries(snapshot.size);
    });

    return () => unsubscribe();
  }, [firestore, week]);


  const totalPrizePool = totalEntries * ENTRY_FEE;

  const getPrize = (rank: number) => {
    const percentage = prizeDistribution[rank];
    if (percentage) {
      return `SSP ${(totalPrizePool * percentage).toLocaleString()}`;
    }
    return '–';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Award className="h-6 w-6 text-slate-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-400" />;
      case 4:
        return <Star className="h-6 w-6 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Weekly Leaderboard</CardTitle>
        <CardDescription>
          {week ? `Top 10 players for ${format(week.start, 'MMM d')} – ${format(week.end, 'MMM d, yyyy')}` : 'Top 10 players of the week.'}
          <br/>
          The board resets every Monday. Prizes are based on entries for the current week.
        </CardDescription>
        <div className="pt-4">
            <p className="text-sm text-muted-foreground">Weekly Entries: {totalEntries}</p>
            <p className="text-lg font-bold text-primary">Current Prize Pool: SSP {totalPrizePool.toLocaleString()}</p>
        </div>
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
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Prize</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score, index) => (
                <TableRow key={score.id} className={index < 4 ? 'font-bold bg-primary/5' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-6 text-center font-semibold">{index + 1}</span>
                      {getRankIcon(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell>{score.playerName}</TableCell>
                  <TableCell className="text-right">{score.score}</TableCell>
                  <TableCell className="text-right text-emerald-600">{getPrize(index + 1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
