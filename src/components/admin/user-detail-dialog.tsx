'use client';
import { useMemo } from 'react';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, type Timestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Award, Star, TrendingUp, HelpCircle, Banknote, Calendar, BrainCircuit, Target, Flame } from 'lucide-react';
import type { UserProfile } from '@/lib/user-profile';

type Score = { id: string; score: number; createdAt: Timestamp; };

const badgeIcons: { [key: string]: React.ElementType } = {
    'Finance Whiz': BrainCircuit,
    'Perfect Score': Target,
    'Hot Streak': Flame,
    'Comeback Kid': TrendingUp,
    'Weekly Warrior': Calendar,
};

type UserDetailDialogProps = {
    userId: string | null;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export default function UserDetailDialog({ userId, isOpen, onOpenChange }: UserDetailDialogProps) {
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => (firestore && userId) ? doc(firestore, 'users', userId) : null, [firestore, userId]);
    const scoresQuery = useMemoFirebase(() => (firestore && userId) ? query(collection(firestore, 'scores'), where('userId', '==', userId)) : null, [firestore, userId]);

    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);
    const { data: scoresData, loading: scoresLoading } = useCollection<Score>(scoresQuery);
    
    const sortedScores = useMemo(() => {
        if (!scoresData) return [];
        return [...scoresData].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    }, [scoresData]);

    const loading = profileLoading || scoresLoading;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                {loading || !userProfile ? (
                    <div className="space-y-4 p-4">
                        <DialogHeader>
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-64" />
                        </DialogHeader>
                        <Skeleton className="h-48 w-full" />
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-left">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary">
                                    <AvatarImage src={userProfile.photoURL ?? ''} alt={userProfile.displayName ?? ''} />
                                    <AvatarFallback>{userProfile.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <DialogTitle className="text-2xl">{userProfile.displayName}</DialogTitle>
                                    <DialogDescription>{userProfile.email}</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                                    <Banknote className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Coin Balance</p>
                                        <p className="font-bold">{userProfile.coins ?? 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                                    <HelpCircle className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Quizzes Played</p>
                                        <p className="font-bold">{sortedScores.length}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {userProfile.badges && userProfile.badges.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">Badges</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {userProfile.badges.map(badge => {
                                            const Icon = badgeIcons[badge] || Award;
                                            return (
                                                <div key={badge} className="flex items-center gap-2 text-xs p-2 bg-accent/20 rounded-md border border-accent/50">
                                                    <Icon className="h-4 w-4 text-accent" />
                                                    <p className="font-medium text-accent-foreground">{badge}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold mb-2">Quiz History</h3>
                                {sortedScores.length > 0 ? (
                                    <ul className="space-y-2">
                                    {sortedScores.map(score => (
                                        <li key={score.id} className="flex justify-between items-center rounded-lg bg-secondary p-3">
                                            <span>{format(score.createdAt.toDate(), 'PPP p')}</span>
                                            <span className="font-bold text-primary">{score.score} pts</span>
                                        </li>
                                    ))}
                                    </ul>
                                ) : <p className="text-muted-foreground text-sm">No quiz history for this user.</p>}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
