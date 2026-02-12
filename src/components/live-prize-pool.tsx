'use client';

import { useMemo } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { startOfWeek, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';

type PrizePool = {
    total: number;
}

export default function LivePrizePool() {
  const firestore = useFirestore();

  const weekId = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    return format(start, 'yyyy-MM-dd');
  }, []);

  const prizePoolRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'prizePools', weekId);
  }, [firestore, weekId]);

  const { data: prizePoolDoc, loading, error } = useDoc<PrizePool>(prizePoolRef);

  const totalPrizePool = useMemo(() => {
    if (!prizePoolDoc) return 0;
    return prizePoolDoc.total;
  }, [prizePoolDoc]);

  if (error) {
    // Fail gracefully, don't break the whole page. The error will be in the console.
    console.error("Failed to load prize pool:", error);
    return null;
  }

  return (
    <Card className="mb-6 bg-accent/10 border-accent/20 text-center animate-in fade-in-50 duration-500">
        <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-xl text-accent">
                <Trophy /> This Week's Live Prize Pool
            </CardTitle>
        </CardHeader>
        <CardContent>
            {loading ? (
                <Skeleton className="h-12 w-48 mx-auto" />
            ) : (
                <p className="text-5xl font-black text-foreground">
                    {totalPrizePool.toLocaleString()} <span className="text-3xl text-muted-foreground">SSP</span>
                </p>
            )}
             <p className="text-xs text-muted-foreground mt-2">
                Prize pool is funded by weekly entry fees. Updates live as more players join.
            </p>
        </CardContent>
    </Card>
  );
}
