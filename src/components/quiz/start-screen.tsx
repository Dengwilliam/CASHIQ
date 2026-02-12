"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, CircleDollarSign, Loader2, Wallet, Award, Coins, Calendar, Trophy } from 'lucide-react';
import type { User } from 'firebase/auth';
import Link from 'next/link';
import LivePrizePool from '@/components/live-prize-pool';

type StartScreenProps = {
  onStartWeekly: () => void;
  onStartDaily: () => void;
  onPayWithCoins: () => void;
  user: User | null;
  loading: boolean;
  hasPlayedThisWeek: boolean | null;
  checkingForPastScore: boolean;
  isGeneratingQuiz: boolean;
  hasApprovedPaymentThisWeek: boolean | null;
  isCheckingPayment: boolean;
  hasPlayedDailyToday: boolean | null;
  isCheckingDaily: boolean;
  coinBalance: number;
  isPayingWithCoins: boolean;
};

export default function StartScreen({ onStartWeekly, onStartDaily, onPayWithCoins, user, loading, hasPlayedThisWeek, checkingForPastScore, isGeneratingQuiz, hasApprovedPaymentThisWeek, isCheckingPayment, hasPlayedDailyToday, isCheckingDaily, coinBalance, isPayingWithCoins }: StartScreenProps) {
  
  const handleWeeklySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !hasPlayedThisWeek && hasApprovedPaymentThisWeek) {
      onStartWeekly();
    }
  };

  const handleDailySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !hasPlayedDailyToday) {
      onStartDaily();
    }
  };

  const renderWeeklyFooter = () => {
    if (loading || checkingForPastScore || isCheckingPayment) {
      return (
        <Button className="w-full" size="lg" disabled>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Checking your status...
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
        <div className="text-center w-full">
          <p className="text-muted-foreground">Please log in to play.</p>
        </div>
      );
    }
    if (hasPlayedThisWeek) {
      return (
        <div className="w-full flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">You've already played this week! Come back on Monday for a new challenge.</p>
            <Button asChild className="w-full" size="lg">
                <Link href="/leaderboard">
                    <BarChart className="mr-2 h-5 w-5" />
                    View Leaderboard
                </Link>
            </Button>
        </div>
      );
    }
    if (!hasApprovedPaymentThisWeek) {
      return (
        <div className="w-full flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">Pay the weekly entry fee to play.</p>
            <Button asChild className="w-full" size="lg">
                <Link href="/wallet">
                    <Wallet className="mr-2 h-5 w-5" />
                    Pay with MoMo
                </Link>
            </Button>
            <div className="relative w-full flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        Or
                    </span>
                </div>
            </div>
            <Button 
                onClick={onPayWithCoins}
                className="w-full" 
                size="lg" 
                variant="secondary"
                disabled={isPayingWithCoins || coinBalance < 1000}
            >
                {isPayingWithCoins ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <Coins className="mr-2 h-5 w-5" />
                )}
                {coinBalance < 1000 ? `Not Enough Coins (${coinBalance})` : `Use 1,000 Coins`}
            </Button>
        </div>
      );
    }
    return (
       <Button type="submit" className="w-full" size="lg" disabled={isGeneratingQuiz}>
          Start Weekly Challenge
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
    )
  }

  const renderDailyFooter = () => {
     if (loading || isCheckingDaily) {
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
      return <p className="text-muted-foreground text-center w-full">Please log in to play.</p>;
    }
    if (hasPlayedDailyToday) {
      return <p className="text-muted-foreground text-center w-full">You've played today. Come back tomorrow for a new quiz!</p>;
    }
    return (
      <Button type="submit" className="w-full" size="lg" disabled={isGeneratingQuiz}>
          Start Daily Quiz
          <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    )
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Learn. Play. Earn.
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 pt-2 max-w-2xl mx-auto">
          Gamified financial literacy with weekly cash rewards and daily coin prizes.
        </p>
        {user && (
            <div className="text-base pt-4">
              Welcome back, <span className="font-bold text-primary">{user.displayName}!</span>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 w-full">
        {/* Weekly Challenge Card */}
        <Card className="bg-card/80 backdrop-blur-lg border-white/5 shadow-xl flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Trophy className="text-primary"/> Weekly Challenge</CardTitle>
                <CardDescription>Top 4 players win a share of the total weekly prize pool!</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <LivePrizePool />
                <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                    <p className="text-2xl font-bold text-primary">25,000 SSP or 1,000 Coins</p>
                </div>
                 <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg text-center border border-primary/20">
                        <p className="font-black text-lg text-primary">1st</p>
                        <p className="text-xs font-semibold text-foreground">30%</p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg text-center">
                        <p className="font-black text-lg text-primary/80">2nd</p>
                        <p className="text-xs font-semibold text-foreground">20%</p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg text-center">
                        <p className="font-black text-lg text-primary/80">3rd</p>
                        <p className="text-xs font-semibold text-foreground">10%</p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg text-center">
                        <p className="font-black text-lg text-primary/80">4th</p>
                        <p className="text-xs font-semibold text-foreground">5%</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleWeeklySubmit} className="w-full">
                {renderWeeklyFooter()}
              </form>
            </CardFooter>
        </Card>

        {/* Daily Quiz Card */}
        <Card className="bg-card/80 backdrop-blur-lg border-white/5 shadow-xl flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Calendar className="text-accent" /> Daily Quiz</CardTitle>
                <CardDescription>A quick 5-question quiz to test your knowledge and earn coins every day!</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                    <p className="text-2xl font-bold text-primary">FREE</p>
                </div>
                 <div className="text-center p-4 border border-dashed border-accent/50 rounded-lg flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-accent flex items-center justify-center gap-2"><Award /> Daily Prize</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Earn <strong className="text-foreground">5 coins</strong> for every correct answer. Use coins to enter the weekly challenge!
                    </p>
                </div>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleDailySubmit} className="w-full">
                {renderDailyFooter()}
              </form>
            </CardFooter>
        </Card>
      </div>
    </>
  );
}
