'use client';
import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, type Timestamp } from 'firebase/firestore';

type ScoreEntry = {
  id: string;
  playerName: string;
  score: number;
  createdAt: Timestamp;
  userId: string;
  rank?: number;
};

type Admin = { id: string; };

export function useLeaderboardScores(week: { start: Date; end: Date; } | null) {
  const firestore = useFirestore();

  const scoresQuery = useMemoFirebase(() => {
    if (!firestore || !week) return null;
    return query(
        collection(firestore, 'scores'), 
        where('createdAt', '>=', week.start),
        where('createdAt', '<=', week.end)
    );
  }, [firestore, week]);
  
  const adminsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'admins'));
  }, [firestore]);

  const { data: allScores, loading: scoresLoading, error: scoresError } = useCollection<ScoreEntry>(scoresQuery);
  const { data: admins, loading: adminsLoading, error: adminsError } = useCollection<Admin>(adminsQuery);

  const loading = scoresLoading || adminsLoading;
  const error = scoresError || adminsError;

  const rankedScores = useMemo(() => {
    if (loading || error || !allScores || !admins) {
        return [];
    }

    const adminIds = new Set(admins.map(admin => admin.id));
    const nonAdminScores = allScores.filter(score => !adminIds.has(score.userId));

    return [...nonAdminScores]
      .sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      })
      .map((score, index) => ({ ...score, rank: index + 1 }));
  }, [allScores, admins, loading, error]);
  
  return { rankedScores, loading, error };
}
