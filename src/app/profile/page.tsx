'use client';
import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import SiteHeader from '@/components/site-header';
import { collection, query, where } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Star, TrendingUp, HelpCircle } from 'lucide-react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';


type Score = {
    id: string;
    score: number;
    createdAt: Timestamp;
    playerName: string;
}

type UserProfile = {
    displayName: string;
    email: string;
    photoURL?: string;
    badges?: string[];
}

function ProfileSkeleton() {
    return (
        <div className="space-y-8">
            <Card className="bg-card/60 backdrop-blur-xl border-primary/20 shadow-xl">
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-48 mt-4" />
                    <Skeleton className="h-5 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                    </div>
                    <div>
                        <Skeleton className="h-8 w-40 mb-4 mx-auto" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                     <div>
                        <Skeleton className="h-8 w-40 mb-4 mx-auto" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function ProfilePage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

    const scoresQueryWithoutOrder = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'scores'),
            where('userId', '==', user.uid)
        );
    }, [firestore, user]);


    const { data: scoresData, loading: scoresLoading } = useCollection<Score>(scoresQueryWithoutOrder);
    
    const sortedScores = useMemo(() => {
        if (!scoresData) return [];
        return [...scoresData].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    }, [scoresData]);

    const { averageScore, highestScore, totalQuizzes } = useMemo(() => {
        if (!sortedScores || sortedScores.length === 0) {
            return { averageScore: 0, highestScore: 0, totalQuizzes: 0 };
        }
        const total = sortedScores.length;
        const totalScore = sortedScores.reduce((acc, s) => acc + s.score, 0);
        const avg = Math.round(totalScore / total);
        const high = Math.max(...sortedScores.map(s => s.score));
        return { averageScore: avg, highestScore: high, totalQuizzes: total };
    }, [sortedScores]);

    const chartData = useMemo(() => {
        if (!scoresData) return [];
        return [...scoresData]
            .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
            .map(score => ({
                date: format(score.createdAt.toDate(), 'MMM d'),
                score: score.score
            }));
    }, [scoresData]);


    if (userLoading) {
        return (
             <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
                <SiteHeader />
                 <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500 mt-24">
                    <ProfileSkeleton />
                </div>
            </main>
        )
    }

    if (!user) {
        return (
             <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
                <SiteHeader />
                <p>Please log in to view your profile.</p>
            </main>
        )
    }

    return (
        <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <SiteHeader />
            <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500 mt-24">
                <Card className="bg-card/60 backdrop-blur-xl border-primary/20 shadow-xl">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                            <AvatarFallback className="text-3xl">
                                {user.displayName?.charAt(0) ?? user.email?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-3xl">{user.displayName}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                         <div>
                            <h2 className="text-2xl font-bold mb-4 text-center">My Stats</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{scoresLoading ? <Skeleton className="h-8 w-16" /> : `${highestScore}`}</div>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{scoresLoading ? <Skeleton className="h-8 w-16" /> : `${averageScore}`}</div>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Quizzes Played</CardTitle>
                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{scoresLoading ? <Skeleton className="h-8 w-16" /> : totalQuizzes}</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {profileLoading ? (
                            <Skeleton className="h-24 w-full" />
                        ) : (userProfile?.badges && userProfile.badges.length > 0) && (
                             <div>
                                <h2 className="text-2xl font-bold mb-4 text-center">My Badges</h2>
                                <div className="flex flex-wrap justify-center gap-4 mb-8">
                                    {userProfile.badges.map(badge => (
                                        <div key={badge} className="flex flex-col items-center gap-2 p-4 bg-accent/20 rounded-lg border border-accent/50 w-32 text-center">
                                            <Award className="h-8 w-8 text-accent" />
                                            <p className="font-semibold text-sm text-accent-foreground">{badge}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {(scoresLoading || chartData.length > 0) && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-center">Performance Over Time</h2>
                                <Card className="p-2 pt-4">
                                    {scoresLoading ? (
                                        <Skeleton className="h-64 w-full" />
                                    ) : (
                                        <ChartContainer config={{ score: { label: 'Score', color: 'hsl(var(--primary))' } }} className="h-64 w-full">
                                            <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} />
                                                <RechartsTooltip 
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--card))',
                                                        borderColor: 'hsl(var(--border))'
                                                    }}
                                                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                                                    itemStyle={{ color: 'hsl(var(--primary))' }}
                                                />
                                                <Line dataKey="score" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                                            </LineChart>
                                        </ChartContainer>
                                    )}
                                </Card>
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center">Quiz History</h2>
                            {scoresLoading ? (
                                 <div className="space-y-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-card rounded-md">
                                            <Skeleton className="h-5 w-1/3" />
                                            <Skeleton className="h-5 w-1/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : sortedScores.length > 0 ? (
                                <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Score</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedScores.map(score => (
                                            <TableRow key={score.id}>
                                                <TableCell>{format(score.createdAt.toDate(), 'PPP')}</TableCell>
                                                <TableCell className="text-right font-bold text-primary">{score.score}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </Card>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">You haven't played any quizzes yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
