'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
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

  const scoresQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'scores'), orderBy('score', 'desc'), limit(10));
  }, [firestore]);

  const { data: scores, loading, error } = useCollection<ScoreEntry>(scoresQuery);

  useEffect(() => {
    if (!firestore) return;
    const scoresCol = collection(firestore, 'scores');
    getDocs(scoresCol).then(snapshot => {
        setTotalEntries(snapshot.size);
    });
  }, [firestore]);

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
        <CardDescription>Top 10 players of the week. Prizes are calculated based on total entries.</CardDescription>
        <div className="pt-4">
            <p className="text-sm text-muted-foreground">Total Entries: {totalEntries}</p>
            <p className="text-lg font-bold text-primary">Total Prize Pool: SSP {totalPrizePool.toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <LeaderboardSkeleton />}
        {error && <p className="text-center text-destructive">Could not load leaderboard. Please try again later.</p>}
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
