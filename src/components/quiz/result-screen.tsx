"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCw, Award } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type ResultScreenProps = {
  score: number;
  onRestart: () => void;
  playerName: string;
  newlyAwardedBadges: string[];
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z"/>
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
    </svg>
);

export default function ResultScreen({ score, onRestart, playerName, newlyAwardedBadges = [] }: ResultScreenProps) {
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client
    setAppUrl(window.location.origin);
  }, []);

  const getResultMessage = () => {
    if (score >= 80) return "Excellent! You're a financial genius!";
    if (score >= 50) return "Good job! You have a solid understanding.";
    if (score >= 20) return "Not bad! A little more study and you'll be an expert.";
    return "Keep learning! Every quiz is a step forward.";
  };

  const shareText = `I scored ${score} on FinQuiz Challenge! Can you beat my score?`;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedAppUrl = encodeURIComponent(appUrl);

  const whatsappUrl = `https://wa.me/?text=${encodedShareText}%20${encodedAppUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedAppUrl}&quote=${encodedShareText}`;

  return (
    <Card className="text-center bg-card/60 backdrop-blur-xl border-primary/20 shadow-xl">
      <CardHeader>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Quiz Finished!</CardTitle>
        <CardDescription className="pt-2 text-base">
          Well done, {playerName}! Your score will be submitted to the weekly leaderboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground">Your Final Score</p>
          <p className="text-5xl font-bold text-primary">{score}</p>
        </div>
        <p className="text-muted-foreground italic">{getResultMessage()}</p>
         {newlyAwardedBadges.length > 0 && (
            <div className="pt-4 space-y-3 animate-in fade-in-50 duration-500">
                <h3 className="font-semibold text-center text-lg">New Badges Unlocked!</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                    {newlyAwardedBadges.map(badge => (
                        <div key={badge} className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg border border-accent/50">
                            <Award className="h-6 w-6 text-accent" />
                            <p className="font-medium text-accent-foreground">{badge}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button onClick={onRestart} className="w-full" size="lg" variant="outline">
          <RotateCw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
        <Button asChild className="w-full" size="lg">
          <Link href="/leaderboard">
            View Leaderboard
          </Link>
        </Button>
      </CardFooter>
      <CardFooter className="flex-col gap-4 pt-4 border-t border-border/20 mt-4">
        <p className="text-sm text-muted-foreground">Challenge a friend</p>
        <div className="flex gap-4">
            <Button asChild variant="outline" className="rounded-full h-12 w-12 p-0 text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors">
                <a href={appUrl ? whatsappUrl : '#'} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
                    <WhatsAppIcon className="h-6 w-6" />
                </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full h-12 w-12 p-0 text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors">
                <a href={appUrl ? facebookUrl : '#'} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                    <FacebookIcon className="h-6 w-6" />
                </a>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
