'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
    momoTransactionId: z.string().min(1, 'Transaction ID is required.'),
    amount: z.coerce.number().min(1000, 'Minimum amount is 1000 SSP.'),
    screenshot: z.any().refine(file => file instanceof File, 'Screenshot is required.'),
});

export default function WalletPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !firestore) return;
        setLoading(true);

        try {
            const storage = getStorage();
            const screenshotRef = ref(storage, `payment-screenshots/${user.uid}/${Date.now()}_${values.screenshot.name}`);
            
            // Upload screenshot
            const snapshot = await uploadBytes(screenshotRef, values.screenshot);
            const screenshotUrl = await getDownloadURL(snapshot.ref);

            // Add transaction to Firestore
            const transactionsCollection = collection(firestore, `users/${user.uid}/payment-transactions`);
            const transactionData = {
                userId: user.uid,
                playerName: user.displayName,
                momoTransactionId: values.momoTransactionId,
                amount: values.amount,
                status: 'pending',
                screenshotUrl,
                createdAt: serverTimestamp(),
            };

            await addDoc(transactionsCollection, transactionData)
             .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: transactionsCollection.path,
                    operation: 'create',
                    requestResourceData: transactionData,
                });
                errorEmitter.emit('permission-error', permissionError);
            });

            toast({
                title: 'Transaction Submitted',
                description: 'Your payment is being reviewed. Please wait for approval.',
            });
            form.reset();

        } catch (error: any) {
            console.error("Payment submission error:", error);
            toast({
                title: 'Submission Failed',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 md:px-6 w-full max-w-4xl text-center">
                <p>Please log in to access your wallet.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 w-full max-w-lg animate-in fade-in-50 duration-500">
            <Card className="bg-card/80 backdrop-blur-lg border-white/5 shadow-xl">
                <CardHeader>
                    <CardTitle>Submit Manual Payment</CardTitle>
                    <CardDescription>
                        After sending money via MTN MoMo, submit your transaction details here for approval.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="momoTransactionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>MoMo Transaction ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., MP240101.1234.A56789" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount (SSP)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 1000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="screenshot"
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Payment Screenshot</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                                                    className="pl-12"
                                                />
                                                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                {loading ? 'Submitting...' : 'Submit for Review'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
