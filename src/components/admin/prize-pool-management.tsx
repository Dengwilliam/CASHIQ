'use client';
import { useMemo, useState } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { startOfWeek, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { adjustPrizePool } from '@/lib/admin';
import { Trophy, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type PrizePool = { total: number };

export default function PrizePoolManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const weekId = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    return format(start, 'yyyy-MM-dd');
  }, []);

  const prizePoolRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'prizePools', weekId);
  }, [firestore, weekId]);

  const { data: prizePoolDoc, loading } = useDoc<PrizePool>(prizePoolRef);

  const handleAdjustment = async (multiplier: 1 | -1) => {
    if (!firestore) return;
    const adjustmentAmount = parseFloat(amount) * multiplier;
    if (isNaN(adjustmentAmount) || adjustmentAmount === 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid number.", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    try {
      await adjustPrizePool(firestore, adjustmentAmount);
      toast({ title: "Success", description: "Prize pool has been updated." });
      setAmount('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Prize Pool Management</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Trophy /> Current Week's Prize Pool</CardTitle>
          <CardDescription>Manually add or remove funds from the live prize pool.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-secondary rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Current Total</p>
            {loading ? (
              <Skeleton className="h-10 w-48 mx-auto mt-1" />
            ) : (
              <p className="text-4xl font-bold text-primary">
                {(prizePoolDoc?.total ?? 0).toLocaleString()} <span className="text-2xl text-muted-foreground">SSP</span>
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Amount in SSP"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isUpdating}
            />
            <div className="flex gap-2">
              <Button onClick={() => handleAdjustment(1)} className="w-full" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin" /> : 'Add to Pool'}
              </Button>
              <Button onClick={() => handleAdjustment(-1)} className="w-full" variant="destructive" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="animate-spin" /> : 'Subtract from Pool'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
