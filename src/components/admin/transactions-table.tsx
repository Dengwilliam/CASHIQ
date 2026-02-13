'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, getDocs, collection } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { updateTransactionStatus } from '@/lib/admin';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { StatusBadge } from '@/components/ui/status-badge';
import type { UserProfile } from '@/lib/user-profile';

type PaymentTransaction = {
    id: string;
    playerName: string;
    momoTransactionId: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Timestamp;
    screenshotUrl?: string;
    userId: string;
};

function TableSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                </div>
            ))}
        </div>
    );
}

export default function TransactionsTable() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'));
    }, [firestore]);

    const { data: users, loading: usersLoading, error: usersError } = useCollection<UserProfile>(usersQuery);

    useEffect(() => {
        if (usersError) {
            setError(usersError);
            setLoading(false);
            return;
        }

        if (!firestore || usersLoading || !users) {
            return;
        }

        setLoading(true);

        const fetchAllTransactions = async () => {
            try {
                const allTransactions: PaymentTransaction[] = [];
                const transactionPromises = users.map(user => {
                    const userTransactionsQuery = query(collection(firestore, 'users', user.id, 'payment-transactions'));
                    return getDocs(userTransactionsQuery);
                });
                
                const userTransactionsSnapshots = await Promise.all(transactionPromises);
                
                userTransactionsSnapshots.forEach(snapshot => {
                    snapshot.forEach(doc => {
                        allTransactions.push({ id: doc.id, ...doc.data() } as PaymentTransaction);
                    });
                });
                setTransactions(allTransactions);
                setError(null);
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAllTransactions();
    }, [firestore, users, usersLoading, usersError]);


    const sortedTransactions = useMemo(() => {
        if (!transactions) return [];
        return [...transactions].sort((a, b) => {
            if (!a.createdAt) return 1; // Push items without a timestamp to the end
            if (!b.createdAt) return -1;
            return b.createdAt.toMillis() - b.createdAt.toMillis();
        });
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        return {
            pending: sortedTransactions?.filter(t => t.status === 'pending') || [],
            approved: sortedTransactions?.filter(t => t.status === 'approved') || [],
            rejected: sortedTransactions?.filter(t => t.status === 'rejected') || [],
        };
    }, [sortedTransactions]);

    const handleUpdateStatus = async (userId: string, transactionId: string, status: 'approved' | 'rejected') => {
        if (!firestore) return;
        setUpdatingId(transactionId);
        try {
            await updateTransactionStatus(firestore, userId, transactionId, status);
            toast({
                title: 'Success',
                description: `Transaction has been ${status}.`,
            });
            // Refetch transactions after update
            setLoading(true);
            const updatedTransactions = [...transactions];
            const txIndex = updatedTransactions.findIndex(tx => tx.id === transactionId);
            if (txIndex > -1) {
                updatedTransactions[txIndex].status = status;
                setTransactions(updatedTransactions);
            }
            setLoading(false);

        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to update transaction.`,
                variant: 'destructive',
            });
        } finally {
            setUpdatingId(null);
        }
    };
    
    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                     <div className="text-center text-destructive p-4 border border-destructive/50 bg-destructive/10 rounded-md">
                        <p className="font-bold">Could not load transactions.</p>
                        <p className="text-sm mt-2">
                            There was an error fetching the transaction data. Please check your connection and permissions.
                        </p>
                        <p className="text-xs mt-2 font-mono">{error.message}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const TransactionList = ({ list }: { list: PaymentTransaction[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Screenshot</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    {list[0]?.status === 'pending' && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map(tx => (
                    <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.playerName}</TableCell>
                        <TableCell className="font-mono text-xs">{tx.momoTransactionId}</TableCell>
                        <TableCell>{tx.createdAt ? format(tx.createdAt.toDate(), 'Pp') : 'N/A'}</TableCell>
                        <TableCell>
                            {tx.screenshotUrl ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <ImageIcon /> View
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Payment Screenshot</DialogTitle>
                                        </DialogHeader>
                                        <div className="relative h-[80vh] w-full">
                                            <Image src={tx.screenshotUrl} alt={`Screenshot for ${tx.momoTransactionId}`} layout="fill" objectFit="contain" />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                'None'
                            )}
                        </TableCell>
                        <TableCell className="text-right"><StatusBadge status={tx.status} /></TableCell>
                        {tx.status === 'pending' && (
                             <TableCell className="text-right space-x-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 text-success-foreground border-success hover:bg-success/20"
                                    onClick={() => handleUpdateStatus(tx.userId, tx.id, 'approved')}
                                    disabled={updatingId === tx.id}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 text-destructive-foreground border-destructive hover:bg-destructive/20"
                                    onClick={() => handleUpdateStatus(tx.userId, tx.id, 'rejected')}
                                    disabled={updatingId === tx.id}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <Card>
            <CardContent className="p-0">
                <Tabs defaultValue="pending">
                    <div className="p-4 border-b">
                        <TabsList>
                            <TabsTrigger value="pending">Pending ({loading ? '...' : filteredTransactions.pending.length})</TabsTrigger>
                            <TabsTrigger value="approved">Approved ({loading ? '...' : filteredTransactions.approved.length})</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected ({loading ? '...' : filteredTransactions.rejected.length})</TabsTrigger>
                        </TabsList>
                    </div>
                    {loading ? <div className="p-6"><TableSkeleton /></div> : (
                        <>
                            <TabsContent value="pending" className="m-0">
                                {filteredTransactions.pending.length > 0 ? <TransactionList list={filteredTransactions.pending} /> : <p className="text-center text-muted-foreground p-8">No pending transactions.</p>}
                            </TabsContent>
                            <TabsContent value="approved" className="m-0">
                                {filteredTransactions.approved.length > 0 ? <TransactionList list={filteredTransactions.approved} /> : <p className="text-center text-muted-foreground p-8">No approved transactions.</p>}
                            </TabsContent>
                            <TabsContent value="rejected" className="m-0">
                                {filteredTransactions.rejected.length > 0 ? <TransactionList list={filteredTransactions.rejected} /> : <p className="text-center text-muted-foreground p-8">No rejected transactions.</p>}
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </CardContent>
        </Card>
    );
}
