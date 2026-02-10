"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Question, Answer } from '@/lib/questions';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuizScreenProps = {
  question: Question;
  onAnswer: (answer: Answer) => void;
  onTimeout: () => void;
  score: number;
  questionNumber: number;
  totalQuestions: number;
};

const TIME_PER_QUESTION = 15;

export default function QuizScreen({ question, onAnswer, onTimeout, score, questionNumber, totalQuestions }: QuizScreenProps) {
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedAnswer(null);
    setIsAnswered(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      if(!isAnswered) {
          onTimeout();
          setIsAnswered(true);
      }
    }
  }, [timeLeft, isAnswered, onTimeout]);

  const handleAnswerClick = (answer: Answer) => {
    if (isAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const getButtonClass = (answer: Answer) => {
    if (!isAnswered) {
      return 'justify-start';
    }
    if (answer.text === selectedAnswer?.text) {
      return answer.isCorrect ? 'bg-green-500/20 border-green-500 text-green-800 dark:text-green-300 hover:bg-green-500/30 justify-between' : 'bg-destructive/20 border-destructive text-destructive-foreground hover:bg-destructive/30 justify-between';
    }
    if (answer.isCorrect) {
      return 'bg-green-500/20 border-green-500 text-green-800 dark:text-green-300 justify-between';
    }
    return 'justify-start opacity-50';
  };
  
  const getIcon = (answer: Answer) => {
    if (!isAnswered) return null;
    if (answer.isCorrect) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (answer.text === selectedAnswer?.text && !answer.isCorrect) return <XCircle className="h-5 w-5 text-destructive" />;
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">Score: <span className="font-bold text-primary">{score}</span></p>
           <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-primary">
            <Clock className="h-4 w-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
        <Progress value={(questionNumber / totalQuestions) * 100} className="w-full" />
        <CardTitle className="pt-6 text-center text-xl md:text-2xl">{question?.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {question?.answers.map((answer, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className={cn("h-auto min-h-[3.5rem] whitespace-normal py-3 transition-all duration-300", getButtonClass(answer))}
              onClick={() => handleAnswerClick(answer)}
              disabled={isAnswered}
            >
              <span className="flex-1 text-left">{answer.text}</span>
              {getIcon(answer)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
