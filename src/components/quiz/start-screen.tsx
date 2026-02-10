"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type StartScreenProps = {
  onStart: (name: string) => void;
};

export default function StartScreen({ onStart }: StartScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    } else {
      setError('Please enter your name to start.');
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Financial Quiz Challenge</CardTitle>
        <CardDescription className="pt-2">Test your knowledge and win big!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Entry Fee</p>
            <p className="text-2xl font-bold text-primary">25,000 SSP</p>
          </div>
          <div>
            <Input
              id="username"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              aria-label="Enter your name"
              className="text-center"
            />
            {error && <p className="text-sm text-destructive mt-2 text-center">{error}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
            Pay & Start Quiz
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
