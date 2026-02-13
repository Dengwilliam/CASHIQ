'use client';
import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, type Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { startOfWeek, format, isThisWeek } from 'date-fns';
import { Users, HelpCircle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Define types locally for this component
type UserProfile = { id: string; createdAt?: Timestamp };
type Score = { id: string; createdAt: Timestamp };
type PrizePool = { id: string; total: number; startDate: Timestamp };

function StatCard({ title, value, icon: Icon, loading }: { title: string; value: string | number; icon: React.ElementType, loading: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}
            </CardContent>
        </Card>
    );
}

export default function DashboardAnalytics() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users')) : null, [firestore]);
    const scoresQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'scores')) : null, [firestore]);
    const prizePoolsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'prizePools')) : null, [firestore]);

    const { data: usersData, loading: usersLoading } = useCollection<UserProfile>(usersQuery);
    const { data: scoresData, loading: scoresLoading } = useCollection<Score>(scoresQuery);
    const { data: prizePoolsData, loading: prizePoolsLoading } = useCollection<PrizePool>(prizePoolsQuery);

    const analyticsData = useMemo(() => {
        const quizzesThisWeek = scoresData?.filter(s => isThisWeek(s.createdAt.toDate(), { weekStartsOn: 1 })).length ?? 0;
        
        const chartData = prizePoolsData
            ?.sort((a, b) => a.startDate.toMillis() - b.startDate.toMillis())
            .map(p => ({
                date: format(p.startDate.toDate(), 'MMM d'),
                total: p.total,
            })) ?? [];

        return {
            totalUsers: usersData?.length ?? 0,
            quizzesThisWeek,
            chartData,
        };
    }, [usersData, scoresData, prizePoolsData]);

    const loading = usersLoading || scoresLoading || prizePoolsLoading;

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Analytics Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Total Users" value={analyticsData.totalUsers} icon={Users} loading={loading} />
                <StatCard title="Quizzes This Week" value={analyticsData.quizzesThisWeek} icon={HelpCircle} loading={loading} />
                <StatCard title="Total Prize Pools" value={analyticsData.chartData.length} icon={TrendingUp} loading={loading} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Prize Pool History</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-64 w-full" /> : analyticsData.chartData.length > 0 ? (
                        <ChartContainer config={{ total: { label: 'Prize Pool', color: 'hsl(var(--primary))' } }} className="h-64 w-full">
                            <ResponsiveContainer>
                                <LineChart data={analyticsData.chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value / 1000}k`} />
                                    <RechartsTooltip 
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))'
                                        }}
                                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                                        itemStyle={{ color: 'hsl(var(--primary))' }}
                                    />
                                    <Line dataKey="total" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ) : <p className="text-muted-foreground text-center py-8">No prize pool history to display.</p>}
                </CardContent>
            </Card>
        </section>
    );
}
