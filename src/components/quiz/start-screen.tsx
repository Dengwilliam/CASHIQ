"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Loader2, Wallet, Award, Coins, Calendar, Trophy } from 'lucide-react';
import type { User } from 'firebase/auth';
import Link from 'next/link';
import LivePrizePool from '@/components/live-prize-pool';

type StartScreenProps = {
  onStartWeekly: () => void;
  onStartDaily: () => void;
  user: User | null;
  loading: boolean;
  hasPlayedThisWeek: boolean | null;
  isGeneratingQuiz: boolean;
  hasPlayedDailyToday: boolean | null;
  coinBalance: number;
};

export default function StartScreen({ onStartWeekly, onStartDaily, user, loading, hasPlayedThisWeek, isGeneratingQuiz, hasPlayedDailyToday, coinBalance }: StartScreenProps) {
  
  const renderWeeklyFooter = () => {
    if (loading) {
      return (
        <Button className="w-full" size="lg" disabled>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Checking your status...
        </Button>
      );
    }
    if (!user) {
      return (
        <Button asChild className="w-full" size="lg">
          <Link href="/login">Log In to Play</Link>
        </Button>
      );
    }
    if (hasPlayedThisWeek) {
      return (
        <Button asChild className="w-full" size="lg">
          <Link href="/leaderboard">
              <BarChart className="mr-2 h-5 w-5" />
              View Leaderboard
          </Link>
        </Button>
      );
    }
    
    const canAfford = coinBalance >= 1000;
    return (
      <div className="w-full flex flex-col items-center gap-2">
        <Button onClick={onStartWeekly} className="w-full" size="lg" disabled={!canAfford || isGeneratingQuiz}>
          {isGeneratingQuiz ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Trophy className="mr-2 h-5 w-5" />}
          Start Weekly Challenge
        </Button>
        {!canAfford && <p className="text-xs text-center text-destructive">You need 1,000 coins to enter. You have {coinBalance}.</p>}
      </div>
    );
  }

  const renderDailyFooter = () => {
     if (loading) {
      return (
        <Button className="w-full" size="lg" disabled>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Checking status...
        </Button>
      );
    }
    if (isGeneratingQuiz) {
        return (
            <Button className="w-full" size="lg" disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Your Quiz...
            </Button>
        );
    }
    if (!user) {
      return (
        <Button asChild className="w-full" size="lg" variant="secondary">
          <Link href="/login">Log In to Play</Link>
        </Button>
      );
    }
    if (hasPlayedDailyToday) {
      return <p className="text-muted-foreground text-center text-sm w-full">You've played today. Come back tomorrow for a new quiz!</p>;
    }
    return (
      <Button onClick={onStartDaily} className="w-full" size="lg" variant="secondary" disabled={isGeneratingQuiz}>
          Start Daily Quiz
          <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    )
  }

  return (
    <Card className="w-full max-w-4xl text-center bg-card/80 backdrop-blur-xl border-border/20 shadow-2xl">
      <CardHeader className="pb-0">
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Learn. Play. Earn.
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 pt-2 max-w-2xl mx-auto">
          Quiz Smart. Win Big.
        </p>
        {user && !loading && (
            <div className="text-base pt-4">
              Welcome back, <span className="font-bold text-primary">{user.displayName}!</span>
            </div>
        )}
      </CardHeader>
      <CardContent>
        <LivePrizePool />
        <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Weekly Challenge */}
            <div className="flex flex-col gap-4 p-6 bg-secondary/50 rounded-lg border">
                <div className="flex-1 space-y-4">
                    <h3 className="font-bold text-2xl flex items-center justify-center gap-3"><Trophy className="text-primary"/> Weekly Challenge</h3>
                    <p className="text-muted-foreground">Top 4 players win a share of the total weekly prize pool!</p>
                     <div className="text-center p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Entry Fee</p>
                        <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">1,000 <Coins className="h-6 w-6 text-accent" /></p>
                    </div>
                </div>
                {renderWeeklyFooter()}
            </div>
            {/* Daily Quiz */}
            <div className="flex flex-col gap-4 p-6 bg-secondary/50 rounded-lg border">
                <div className="flex-1 space-y-4">
                    <h3 className="font-bold text-2xl flex items-center justify-center gap-3"><Calendar className="text-accent" /> Daily Quiz</h3>
                    <p className="text-muted-foreground">A quick 5-question quiz to test your knowledge and earn coins every day!</p>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                        <h4 className="text-lg font-semibold text-accent flex items-center justify-center gap-2"><Award /> Daily Prize</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Earn <strong className="text-foreground">5 coins</strong> for every correct answer. Use coins to enter the weekly challenge!
                        </p>
                    </div>
                </div>
                {renderDailyFooter()}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
