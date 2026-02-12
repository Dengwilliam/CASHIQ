'use client';

import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, where, type Timestamp } from 'firebase/firestore';
import { startOfWeek, endOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';

type PaymentTransaction = {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    entryType: 'cash' | 'coins';
    createdAt: Timestamp;
};

export default function LivePrizePool() {
  const firestore = useFirestore();

  const currentWeek = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    return { start, end };
  }, []);

  const paymentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collectionGroup(firestore, 'payment-transactions'), 
        where('status', '==', 'approved'),
        where('entryType', '==', 'cash'),
        where('createdAt', '>=', currentWeek.start),
        where('createdAt', '<=', currentWeek.end)
    );
  }, [firestore, currentWeek]);

  const { data: approvedTransactions, loading, error } = useCollection<PaymentTransaction>(paymentsQuery);

  const totalPrizePool = useMemo(() => {
    if (!approvedTransactions) return 0;
    return approvedTransactions.reduce((total, tx) => total + tx.amount, 0);
  }, [approvedTransactions]);

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
