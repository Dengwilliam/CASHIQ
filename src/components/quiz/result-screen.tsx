"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCw, Award, CheckCircle, XCircle, Coins, Share2, Download } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import type { Question, Answer } from '@/lib/questions';
import { generateShareImage, type ShareImageInput } from '@/ai/flows/generate-share-image-flow';
import { Skeleton } from '@/components/ui/skeleton';


type AnsweredQuestion = {
  question: Question;
  selectedAnswer: Answer;
  isCorrect: boolean;
  explanation: string | null;
};

type ResultScreenProps = {
  score: number;
  onRestart: () => void;
  playerName: string;
  newlyAwardedBadges?: string[];
  answeredQuestions?: AnsweredQuestion[];
  quizType: 'weekly' | 'daily' | null;
};


export default function ResultScreen({ score, onRestart, playerName, newlyAwardedBadges = [], answeredQuestions = [], quizType }: ResultScreenProps) {
  const [shareImageSvg, setShareImageSvg] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const isWeekly = quizType === 'weekly';

  useEffect(() => {
    const generateImage = async () => {
      if (!quizType) return;
      setIsGeneratingImage(true);
      try {
        const input: ShareImageInput = {
          playerName,
          score,
          quizType,
          badges: newlyAwardedBadges,
        };
        const result = await generateShareImage(input);
        setShareImageSvg(result.svg);
      } catch (error) {
        console.error("Failed to generate share image", error);
        setShareImageSvg(null);
      } finally {
        setIsGeneratingImage(false);
      }
    };

    generateImage();
  }, [playerName, score, quizType, newlyAwardedBadges]);


  const getResultMessage = () => {
    if (isWeekly) {
        if (score >= 80) return "Excellent! You're a financial genius!";
        if (score >= 50) return "Good job! You have a solid understanding.";
        if (score >= 20) return "Not bad! A little more study and you'll be an expert.";
        return "Keep learning! Every quiz is a step forward.";
    }
    return "Nice one! A little bit of knowledge every day goes a long way.";
  };

  const shareText = isWeekly 
    ? `I scored ${score} on CashIQ! Can you beat my score?`
    : `I just completed my daily quiz on CashIQ!`;

  const handleDownload = () => {
    if (!shareImageSvg) return;
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(shareImageSvg)));
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'cashiq-result.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!shareImageSvg) return;
    
    const blob = new Blob([shareImageSvg], { type: 'image/svg+xml' });
    const file = new File([blob], 'result.svg', { type: 'image/svg+xml' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'My CashIQ Score!',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleDownload();
    }
  };

  return (
    <Card className="text-center bg-card/80 backdrop-blur-xl border-border/20 shadow-2xl">
      <CardHeader>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
          {isWeekly ? <Trophy className="h-12 w-12 text-primary" /> : <Coins className="h-12 w-12 text-primary" />}
        </div>
        <CardTitle className="text-3xl font-bold">{isWeekly ? 'Quiz Finished!' : 'Daily Challenge Complete!'}</CardTitle>
        <CardDescription className="pt-2 text-base">
          {isWeekly ? `Well done, ${playerName}! Your score will be submitted to the weekly leaderboard.` : `Good job, ${playerName}! You've earned some coins.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground">{isWeekly ? 'Your Final Score' : 'Coins Earned'}</p>
          <p className="text-6xl font-black text-primary">{score}</p>
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

        <div className="pt-6 text-left">
          <h3 className="text-xl font-bold mb-4 text-center">Share Your Results</h3>
          <div className="flex flex-col items-center gap-4">
            {isGeneratingImage && (
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="w-[300px] h-[157.5px] rounded-lg" />
                <p className="text-sm text-muted-foreground">Generating your share card...</p>
              </div>
            )}
            {shareImageSvg && !isGeneratingImage && (
              <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg border border-border" dangerouslySetInnerHTML={{ __html: shareImageSvg }} />
            )}
            {!shareImageSvg && !isGeneratingImage && (
               <div className="flex flex-col items-center gap-2 text-center p-4 bg-destructive/10 border border-destructive/50 rounded-lg w-full max-w-md">
                  <p className="text-sm text-destructive-foreground font-semibold">Sorry, we couldn't generate your share card.</p>
              </div>
            )}
            <div className="flex gap-4">
              <Button onClick={handleShare} size="lg" disabled={isGeneratingImage || !shareImageSvg}>
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </Button>
              <Button onClick={handleDownload} size="lg" variant="secondary" disabled={isGeneratingImage || !shareImageSvg}>
                  <Download className="mr-2 h-5 w-5" />
                  Download
              </Button>
          </div>
          </div>
        </div>

        {answeredQuestions.length > 0 && (
            <div className="pt-6 text-left">
                <h3 className="text-xl font-bold mb-3 text-center">Quiz Review</h3>
                <Accordion type="single" collapsible className="w-full">
                    {answeredQuestions.map(({ question, selectedAnswer, isCorrect, explanation }, index) => (
                        <AccordionItem value={`item-${index}`} key={question.id}>
                            <AccordionTrigger className="hover:no-underline text-base">
                                <div className="flex items-center gap-3 flex-1">
                                    {isCorrect ? (
                                        <CheckCircle className="h-5 w-5 text-success shrink-0" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-destructive shrink-0" />
                                    )}
                                    <span className="text-left flex-1">{question.text}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pl-8">
                                <p className="text-sm">Your answer: <span className={cn("font-semibold", !isCorrect && "text-destructive")}>{selectedAnswer.text}</span></p>
                                {!isCorrect && (
                                    <>
                                      <p className="text-sm">Correct answer: <span className="font-semibold text-success">{question.answers.find(a => a.isCorrect)?.text}</span></p>
                                      {explanation && (
                                          <div className="p-3 bg-secondary rounded-md border border-border mt-2">
                                              <p className="text-sm text-muted-foreground">{explanation}</p>
                                          </div>
                                      )}
                                    </>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button onClick={onRestart} className="w-full" size="lg" variant="outline">
          <RotateCw className="mr-2 h-5 w-5" />
          {isWeekly ? 'Play Again' : 'Back to Home'}
        </Button>
        {isWeekly && (
            <Button asChild className="w-full" size="lg">
              <Link href="/leaderboard">
                View Leaderboard
              </Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
