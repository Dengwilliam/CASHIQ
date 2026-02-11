'use client';

import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

type UserProfile = {
    id: string;
    displayName: string;
    email: string;
    momoNumber?: string;
};

function TableSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/3" />
                </div>
            ))}
        </div>
    );
}

export default function UsersTable() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'));
    }, [firestore]);

    const { data: users, loading, error } = useCollection<UserProfile>(usersQuery);
    
    const sortedUsers = useMemo(() => {
        if (!users) return [];
        return [...users].sort((a, b) => a.displayName.localeCompare(b.displayName));
    }, [users]);
    
    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Users /> User Payout Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="text-center text-destructive p-4 border border-destructive/50 bg-destructive/10 rounded-md">
                        <p className="font-bold">Could not load user data.</p>
                        <p className="text-sm mt-2">{error.message}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Users /> User Payout Information</CardTitle>
                <CardDescription>A list of all users and their registered MoMo numbers for payouts.</CardDescription>
            </CardHeader>
            <CardContent>
                 {loading ? <TableSkeleton /> : sortedUsers && sortedUsers.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Display Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>MoMo Number</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.displayName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="font-mono text-sm">{user.momoNumber || 'Not set'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-muted-foreground p-8">No users found.</p>
                )}
            </CardContent>
        </Card>
    );
}
