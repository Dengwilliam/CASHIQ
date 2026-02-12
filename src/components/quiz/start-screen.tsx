"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, CircleDollarSign, Loader2, Wallet, Award, Coins } from 'lucide-react';
import type { User } from 'firebase/auth';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <Card className="bg-card/60 backdrop-blur-xl border-primary/20 shadow-xl transition-all duration-300 hover:border-primary/40">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl sm:text-5xl font-black text-foreground flex items-center justify-center flex-wrap gap-x-4">
          <span>Learn. Play. Earn.</span>
          <CircleDollarSign className="w-12 h-12 md:w-16 md:h-16 text-primary" />
        </CardTitle>
        <CardDescription className="text-base sm:text-lg text-foreground/80 pt-2">
          Gamified financial literacy with weekly cash rewards and daily coin prizes.
        </CardDescription>
        {user && (
            <div className="text-center text-base pt-4">
              Welcome, <span className="font-bold text-primary">{user.displayName}!</span>
            </div>
        )}
      </CardHeader>
      
      <CardContent className="p-2 sm:p-6">
        <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">Weekly Challenge</TabsTrigger>
                <TabsTrigger value="daily">Daily Quiz</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
                <form onSubmit={handleWeeklySubmit}>
                    <CardContent className="space-y-4 pt-6">
                        <div className="text-center p-4 bg-secondary rounded-lg">
                            <p className="text-sm text-muted-foreground">Entry Fee</p>
                            <p className="text-2xl font-bold text-primary">25,000 SSP</p>
                        </div>
                        <div className="text-center p-4 border border-dashed border-primary/50 rounded-lg">
                            <h3 className="text-lg font-semibold text-primary">Weekly Competition!</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Top 4 players win a share of the total weekly entry fees!
                            </p> 
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-center border border-primary/20">
                                    <p className="font-black text-xl text-primary">1st</p>
                                    <p className="text-sm font-semibold text-foreground">30%</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg text-center">
                                    <p className="font-black text-xl text-primary/80">2nd</p>
                                    <p className="text-sm font-semibold text-foreground">20%</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg text-center">
                                    <p className="font-black text-xl text-primary/80">3rd</p>
                                    <p className="text-sm font-semibold text-foreground">10%</p>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg text-center">
                                    <p className="font-black text-xl text-primary/80">4th</p>
                                    <p className="text-sm font-semibold text-foreground">5%</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                      {renderWeeklyFooter()}
                    </CardFooter>
                </form>
            </TabsContent>
            <TabsContent value="daily">
                 <form onSubmit={handleDailySubmit}>
                    <CardContent className="space-y-4 pt-6">
                       <div className="text-center p-4 bg-secondary rounded-lg">
                            <p className="text-sm text-muted-foreground">Entry Fee</p>
                            <p className="text-2xl font-bold text-primary">FREE</p>
                        </div>
                         <div className="text-center p-4 border border-dashed border-accent/50 rounded-lg">
                            <h3 className="text-lg font-semibold text-accent flex items-center justify-center gap-2"><Award /> Daily Prize</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                A quick 5-question quiz to test your knowledge and earn coins every day!
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                      {renderDailyFooter()}
                    </CardFooter>
                </form>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
