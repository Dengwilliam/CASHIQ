"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChartHorizontal } from "lucide-react";

import StartScreen from "@/components/quiz/start-screen";
import QuizScreen from "@/components/quiz/quiz-screen";
import ResultScreen from "@/components/quiz/result-screen";
import type { Question, Answer } from "@/lib/questions";
import { questions as allQuestions } from "@/lib/questions";
import { adjustQuizDifficulty } from "@/ai/flows/adaptive-quiz-difficulty";
import { useToast } from "@/hooks/use-toast";

type GameState = "start" | "quiz" | "results";
type Difficulty = "easy" | "medium" | "hard";

const QUESTIONS_PER_GAME = 10;
const TAB_SWITCH_PENALTY = 5;
const PERFORMANCE_CHECK_INTERVAL = 3;

// Utility to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [recentPerformance, setRecentPerformance] = useState<boolean[]>([]);
  const { toast } = useToast();

  const setupGame = useCallback(() => {
    const shuffledQuestions = shuffleArray(allQuestions.filter(q => q.difficulty === 'medium')).slice(0, QUESTIONS_PER_GAME);
    const questionsWithShuffledAnswers = shuffledQuestions.map(q => ({
      ...q,
      answers: shuffleArray(q.answers)
    }));
    setQuestions(questionsWithShuffledAnswers);
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState === "quiz") {
        setScore((prevScore) => Math.max(0, prevScore - TAB_SWITCH_PENALTY));
        toast({
          title: "Penalty Applied",
          description: `You lost ${TAB_SWITCH_PENALTY} points for switching tabs.`,
          variant: "destructive",
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gameState, toast]);

  const handleStartGame = (name: string) => {
    localStorage.setItem('finquiz-player-name', name);
    setPlayerName(name);
    setScore(0);
    setCurrentQuestionIndex(0);
    setDifficulty("medium");
    setRecentPerformance([]);
    setupGame(); // Re-shuffle questions for a new game
    setGameState("quiz");
  };

  const handleAnswer = async (answer: Answer) => {
    const isCorrect = answer.isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 10);
    }
    
    const updatedPerformance = [...recentPerformance, isCorrect];
    setRecentPerformance(updatedPerformance);

    if (updatedPerformance.length >= PERFORMANCE_CHECK_INTERVAL) {
      try {
        const result = await adjustQuizDifficulty({ recentPerformance: updatedPerformance });
        let newDifficulty = difficulty;
        if (result.difficultyAdjustment === 'increase' && difficulty !== 'hard') {
            newDifficulty = difficulty === 'easy' ? 'medium' : 'hard';
        } else if (result.difficultyAdjustment === 'decrease' && difficulty !== 'easy') {
            newDifficulty = difficulty === 'hard' ? 'medium' : 'easy';
        }
        
        if (newDifficulty !== difficulty) {
            setDifficulty(newDifficulty);
             toast({
                title: "Difficulty Adjusted",
                description: `Difficulty is now ${newDifficulty}.`,
            });

            const remainingQuestionsCount = questions.length - (currentQuestionIndex + 1);
            if (remainingQuestionsCount > 0) {
              const newDifficultyQuestions = allQuestions.filter(q => q.difficulty === newDifficulty);
              const currentQuestionIds = new Set(questions.map(q => q.id));
              const freshQuestions = shuffleArray(newDifficultyQuestions.filter(q => !currentQuestionIds.has(q.id)));
              
              const nextQuestions = freshQuestions.slice(0, remainingQuestionsCount).map(q => ({
                ...q,
                answers: shuffleArray(q.answers)
              }));

              if (nextQuestions.length > 0) {
                const updatedQuestions = [...questions.slice(0, currentQuestionIndex + 1), ...nextQuestions];
                setQuestions(updatedQuestions);
              }
            }
        }
      } catch (error) {
        console.error("AI difficulty adjustment failed:", error);
      }
      setRecentPerformance([]); // Reset after check
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setGameState("results");
      }
    }, 1500); // Wait for feedback animation
  };
  
  const handleTimeout = () => {
     handleAnswer({ text: "", isCorrect: false });
  };


  const handleRestart = () => {
    setGameState("start");
  };

  const renderGameState = () => {
    switch (gameState) {
      case "quiz":
        return (
          <QuizScreen
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onTimeout={handleTimeout}
            score={score}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            difficulty={difficulty}
          />
        );
      case "results":
        return <ResultScreen score={score} onRestart={handleRestart} playerName={playerName} />;
      case "start":
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
       <div className="absolute top-6 left-6 flex items-center gap-2 text-foreground/80">
          <BarChartHorizontal className="h-6 w-6" />
          <h1 className="text-lg font-semibold">FinQuiz Challenge</h1>
       </div>
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
        {renderGameState()}
      </div>
    </main>
  );
}
