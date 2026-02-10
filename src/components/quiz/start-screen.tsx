"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart } from 'lucide-react';
import type { User } from 'firebase/auth';
import Link from 'next/link';

type StartScreenProps = {
  onStart: () => void;
  user: User | null;
  loading: boolean;
  hasPlayedThisWeek: boolean | null;
  checkingForPastScore: boolean;
};

export default function StartScreen({ onStart, user, loading, hasPlayedThisWeek, checkingForPastScore }: StartScreenProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !hasPlayedThisWeek) {
      onStart();
    }
  };

  const renderFooterContent = () => {
    if (loading) {
      return (
        <Button className="w-full" size="lg" disabled>
          Loading...
        </Button>
      );
    }
    if (checkingForPastScore) {
      return (
        <Button className="w-full" size="lg" disabled>
          Checking your status...
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
    return (
       <Button type="submit" className="w-full" size="lg">
          Start Quiz
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
    )
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="text-center">
        <CardTitle className="text-5xl md:text-7xl font-black text-foreground">Learn. Play. Earn.</CardTitle>
        <CardDescription className="text-lg md:text-xl text-foreground/80 pt-2">
          Gamified financial literacy with weekly cash rewards
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-8">
          {user && (
            <div className="text-center text-lg">
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
