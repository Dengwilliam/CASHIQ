"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { User } from 'firebase/auth';

type StartScreenProps = {
  onStart: () => void;
  user: User | null;
  loading: boolean;
};

export default function StartScreen({ onStart, user, loading }: StartScreenProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onStart();
    }
  };

  return (
    <Card className="border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Financial Quiz Challenge</CardTitle>
        <CardDescription className="pt-2">Test your knowledge and compete for weekly prizes!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Entry Fee</p>
            <p className="text-2xl font-bold text-primary">25,000 SSP</p>
          </div>
           <div className="text-center p-4 border border-dashed border-primary/50 rounded-lg">
              <h3 className="text-lg font-semibold text-primary">Weekly Competition!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                  Top 4 players win a share of the total weekly entry fees!
              </p>
              <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                  <div>
                      <p className="font-bold text-lg text-primary/80">30%</p>
                      <p className="text-xs text-muted-foreground">1st Place</p>
                  </div>
                  <div>
                      <p className="font-bold text-lg text-primary/80">20%</p>
                      <p className="text-xs text-muted-foreground">2nd Place</p>
                  </div>
                  <div>
                      <p className="font-bold text-lg text-primary/80">10%</p>
                      <p className="text-xs text-muted-foreground">3rd Place</p>
                  </div>
                  <div>
                      <p className="font-bold text-lg text-primary/80">5%</p>
                      <p className="text-xs text-muted-foreground">4th Place</p>
                  </div>
              </div>
          </div>
          {user && (
            <div className="text-center text-lg">
              Welcome, <span className="font-bold text-primary">{user.displayName}!</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {loading ? (
             <Button className="w-full" size="lg" disabled>
              Loading...
            </Button>
          ) : user ? (
            <Button type="submit" className="w-full" size="lg">
              Pay & Start Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <div className="text-center w-full">
              <p className="text-muted-foreground">Please log in to play.</p>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
