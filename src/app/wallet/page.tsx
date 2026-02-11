'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { collection, query, where, orderBy, addDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { Badge, FileText, Send, Landmark } from 'lucide-react';

import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import SiteHeader from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge as UiBadge } from '@/components/ui/badge';


const formSchema = z.object({
  transactionId: z.string().min(5, { message: 'Transaction ID must be at least 5 characters long.' }),
});

type PaymentTransaction = {
    id: string;
    momoTransactionId: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Timestamp;
}

function HistorySkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                </div>
            ))}
        </div>
    );
}

const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
        case 'pending':
            return <UiBadge variant="secondary">Pending</UiBadge>;
        case 'approved':
            return <UiBadge className="bg-success/20 text-success-foreground border border-success/50 hover:bg-success/30">Approved</UiBadge>;
        case 'rejected':
            return <UiBadge variant="destructive">Rejected</UiBadge>;
        default:
            return <UiBadge variant="outline">{status}</UiBadge>;
    }
};

export default function WalletPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            transactionId: '',
        },
    });

    const transactionsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'payment-transactions'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user]);

    const { data: transactions, loading: transactionsLoading } = useCollection<PaymentTransaction>(transactionsQuery);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!firestore || !user) {
            toast({
                title: 'Error',
                description: 'You must be logged in to submit a payment.',
                variant: 'destructive',
            });
            return;
        }

        const transactionData = {
            userId: user.uid,
            momoTransactionId: values.transactionId,
            amount: 25000,
            status: 'pending' as const,
        };

        const collectionRef = collection(firestore, 'payment-transactions');
        
        addDoc(collectionRef, { ...transactionData, createdAt: serverTimestamp() })
            .then(() => {
                toast({
                    title: 'Success!',
                    description: 'Your payment proof has been submitted for review.',
                });
                form.reset();
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: collectionRef.path,
                    operation: 'create',
                    requestResourceData: { ...transactionData, createdAt: 'SERVER_TIMESTAMP' },
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({
                    title: 'Submission Failed',
                    description: 'Could not save your payment proof. Please try again.',
                    variant: 'destructive',
                });
            });
    }

    if (userLoading) {
        return (
             <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
                <SiteHeader />
                 <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500 mt-24">
                    <Card><CardContent className="p-6"><HistorySkeleton /></CardContent></Card>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
             <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
                <SiteHeader />
                <p>Please log in to view your wallet.</p>
            </main>
        )
    }

    return (
        <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <SiteHeader />
            <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500 mt-24 space-y-8">
                <header>
                    <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">My Wallet</h1>
                    <p className="mt-2 text-base text-foreground/80 max-w-2xl">Manage your payments and view your transaction history.</p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-card/60 backdrop-blur-xl border-primary/20 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Landmark /> Manual Payment Instructions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>To add funds to your wallet and participate in the quiz, please send the entry fee of <strong className="text-primary">25,000 SSP</strong> to the following MTN MoMo account:</p>
                            <div className="p-4 bg-secondary rounded-lg text-center">
                                <p className="text-sm text-muted-foreground">MTN MoMo Number</p>
                                <p className="text-2xl font-bold text-primary">09XX XXX XXX</p>
                            </div>
                            <p className="text-sm text-muted-foreground">After sending the payment, copy the <strong className="text-foreground">Transaction ID</strong> from your confirmation message and submit it here.</p>
                        </CardContent>
                    </Card>

                     <Card className="bg-card/60 backdrop-blur-xl border-primary/20 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Send />Submit Payment Proof</CardTitle>
                            <CardDescription>Enter your MoMo Transaction ID below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="transactionId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>MoMo Transaction ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., MP240101.1234.A12345" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Submitting...' : 'Submit for Review'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>


                <Card className="bg-card/60 backdrop-blur-xl border-primary/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><FileText /> Transaction History</CardTitle>
                        <CardDescription>Your payment submission history.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {transactionsLoading ? (
                           <HistorySkeleton />
                       ) : transactions && transactions.length > 0 ? (
                           <Table>
                               <TableHeader>
                                   <TableRow>
                                       <TableHead>Transaction ID</TableHead>
                                       <TableHead>Date</TableHead>
                                       <TableHead>Amount</TableHead>
                                       <TableHead className="text-right">Status</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {transactions.map(tx => (
                                       <TableRow key={tx.id}>
                                           <TableCell className="font-mono text-xs">{tx.momoTransactionId}</TableCell>
                                           <TableCell>{format(tx.createdAt.toDate(), 'PPP p')}</TableCell>
                                           <TableCell className="font-semibold">{tx.amount.toLocaleString()} SSP</TableCell>
                                           <TableCell className="text-right">{getStatusBadge(tx.status)}</TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                       ) : (
                           <p className="text-muted-foreground text-center py-8">You have no payment history.</p>
                       )}
                    </CardContent>
                </Card>

            </div>
        </main>
    );
}
