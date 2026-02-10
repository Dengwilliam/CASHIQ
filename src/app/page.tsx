"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChartHorizontal } from "lucide-react";

import StartScreen from "@/components/quiz/start-screen";
import QuizScreen from "@/components/quiz/quiz-screen";
import ResultScreen from "@/components/quiz/result-screen";
import type { Question, Answer } from "@/lib/questions";
import { questions as allQuestions } from "@/lib/questions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { saveScore } from "@/lib/scores";


type GameState = "start" | "quiz" | "results";

const QUESTIONS_PER_GAME = 10;
const TAB_SWITCH_PENALTY = 5;

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

  const { firestore } = useFirestore();
  const { toast } = useToast();

  const setupGame = useCallback(() => {
    const shuffledQuestions = shuffleArray(allQuestions).slice(0, QUESTIONS_PER_GAME);
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
    if (gameState === "results" && firestore && playerName) {
      saveScore(firestore, { playerName, score });
    }
  }, [gameState, firestore, playerName, score]);

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
    setupGame(); // Re-shuffle questions for a new game
    setGameState("quiz");
  };

  const handleAnswer = async (answer: Answer) => {
    const isCorrect = answer.isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 10);
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
