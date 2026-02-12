"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, CircleDollarSign, Loader2, Wallet } from 'lucide-react';
import type { User } from 'firebase/auth';
import Link from 'next/link';

type StartScreenProps = {
  onStart: () => void;
  user: User | null;
  loading: boolean;
  hasPlayedThisWeek: boolean | null;
  checkingForPastScore: boolean;
  isGeneratingQuiz: boolean;
  hasApprovedPaymentThisWeek: boolean | null;
  isCheckingPayment: boolean;
};

export default function StartScreen({ onStart, user, loading, hasPlayedThisWeek, checkingForPastScore, isGeneratingQuiz, hasApprovedPaymentThisWeek, isCheckingPayment }: StartScreenProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !hasPlayedThisWeek && hasApprovedPaymentThisWeek) {
      onStart();
    }
  };

  const renderFooterContent = () => {
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
            <p className="text-center text-muted-foreground">Your payment for this week's quiz needs to be approved before you can play.</p>
            <Button asChild className="w-full" size="lg">
                <Link href="/wallet">
                    <Wallet className="mr-2 h-5 w-5" />
                    Go to Wallet
                </Link>
            </Button>
        </div>
      );
    }
    return (
       <Button type="submit" className="w-full" size="lg" disabled={isGeneratingQuiz}>
          Start Quiz
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
          Gamified financial literacy with weekly cash rewards
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-8">
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
          {user && (
            <div className="text-center text-base pt-4">
              Welcome, <span className="font-bold text-primary">{user.displayName}!</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {renderFooterContent()}
        </CardFooter>
      </form>
    </Card>
  );
}
