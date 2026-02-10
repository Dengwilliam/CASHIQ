"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCw } from 'lucide-react';

type ResultScreenProps = {
  score: number;
  onRestart: () => void;
  playerName: string;
};

export default function ResultScreen({ score, onRestart, playerName }: ResultScreenProps) {
  const getResultMessage = () => {
    if (score >= 80) return "Excellent! You're a financial genius!";
    if (score >= 50) return "Good job! You have a solid understanding.";
    if (score >= 20) return "Not bad! A little more study and you'll be an expert.";
    return "Keep learning! Every quiz is a step forward.";
  };

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent mb-4">
          <Trophy className="h-10 w-10 text-accent-foreground" />
        </div>
        <CardTitle className="text-3xl font-bold">Quiz Finished!</CardTitle>
        <CardDescription className="pt-2">
          Well done, {playerName}! Here's how you did.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Your Final Score</p>
          <p className="text-5xl font-bold text-primary">{score}</p>
        </div>
        <p className="text-muted-foreground italic">{getResultMessage()}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onRestart} className="w-full" size="lg">
          <RotateCw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
      </CardFooter>
    </Card>
  );
}
