"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, type Timestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { startOfWeek, endOfWeek, isMonday } from 'date-fns';

import StartScreen from "@/components/quiz/start-screen";
import PaymentScreen from "@/components/quiz/payment-screen";
import QuizScreen from "@/components/quiz/quiz-screen";
import ResultScreen from "@/components/quiz/result-screen";
import type { Question, Answer } from "@/lib/questions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { saveScore } from "@/lib/scores";
import SiteHeader from "@/components/site-header";
import { generateQuiz } from "@/ai/flows/generate-quiz-flow";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


type GameState = "start" | "payment" | "quiz" | "results";

const QUESTIONS_PER_GAME = 10;
const TAB_SWITCH_PENALTY = 5;

// Utility to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasPlayedThisWeek, setHasPlayedThisWeek] = useState<boolean | null>(null);
  const [checkingForPastScore, setCheckingForPastScore] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [newlyAwardedBadges, setNewlyAwardedBadges] = useState<string[]>([]);


  const firestore = useFirestore();
  const { user, loading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const today = new Date();
    const newQuizNotificationKey = `new_quiz_notification_${startOfWeek(today, { weekStartsOn: 1 }).toISOString()}`;
    
    if (isMonday(today) && !localStorage.getItem(newQuizNotificationKey)) {
        toast({
            title: "New Quiz Available!",
            description: "A new week's challenge has begun. Test your knowledge now!",
            duration: 7000,
        });
        localStorage.setItem(newQuizNotificationKey, 'true');
    }
  }, [toast]);

  const setupGame = useCallback(async () => {
    setIsGeneratingQuiz(true);
    try {
      const quizOutput = await generateQuiz({ count: QUESTIONS_PER_GAME, difficulty: 'medium' });
      const questionsWithShuffledAnswers = quizOutput.questions.map(q => ({
        ...q,
        answers: shuffleArray(q.answers)
      }));
      setQuestions(questionsWithShuffledAnswers);
    } catch (error) {
        console.error("Failed to generate AI quiz:", error);
        toast({
            title: "Error",
            description: "Could not generate a new quiz. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsGeneratingQuiz(false);
    }
  }, [toast]);

  useEffect(() => {
    const awardBadges = async () => {
        if (!firestore || !user) return;
        
        const badges: string[] = [];
        if (score >= 80 && score < 100) {
            badges.push("Finance Whiz");
        }
        if (score === 100) {
            badges.push("Perfect Score");
        }

        if (badges.length > 0) {
            setNewlyAwardedBadges(badges);
            const userRef = doc(firestore, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    badges: arrayUnion(...badges)
                });
            } catch (e) {
                console.error("Failed to save badges", e);
                const permissionError = new FirestorePermissionError({
                    path: userRef.path,
                    operation: 'update',
                    requestResourceData: { badges: arrayUnion(...badges) },
                });
                errorEmitter.emit('permission-error', permissionError);
            }
        }
    }
    
    if (gameState === "results") {
      if (firestore && user) {
        saveScore(firestore, { 
          playerName: user.displayName || "Anonymous", 
          score,
          userId: user.uid
        });
        awardBadges();
      }
      // After saving the score, mark that the user has played this week
      setHasPlayedThisWeek(true);
    }
  }, [gameState, firestore, user, score]);

  useEffect(() => {
    const checkUserScore = async () => {
      if (!firestore || !user) {
        setHasPlayedThisWeek(null);
        setCheckingForPastScore(false);
        return;
      }
      setCheckingForPastScore(true);

      const today = new Date();
      const start = startOfWeek(today, { weekStartsOn: 1 });
      const end = endOfWeek(today, { weekStartsOn: 1 });

      const scoresQuery = query(
        collection(firestore, 'scores'),
        where('userId', '==', user.uid)
      );

      try {
        const querySnapshot = await getDocs(scoresQuery);
        const scoresThisWeek = querySnapshot.docs.filter(doc => {
            const scoreData = doc.data();
            // serverTimestamp is null until the server acknowledges the write, so we check.
            if (scoreData.createdAt) {
                const scoreDate = (scoreData.createdAt as Timestamp).toDate();
                return scoreDate >= start && scoreDate <= end;
            }
            return false;
        });
        setHasPlayedThisWeek(scoresThisWeek.length > 0);
      } catch (error) {
        console.error("Error checking for past score:", error);
        setHasPlayedThisWeek(false); // Assume they can play if there's an error
      } finally {
        setCheckingForPastScore(false);
      }
    };

    checkUserScore();
  }, [user, firestore, gameState]);


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

  const handleStartGame = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You must be logged in to start the quiz.",
        variant: "destructive",
      });
      return;
    }
     if (hasPlayedThisWeek) {
      toast({
        title: "Already Played",
        description: "You can only play the quiz once per week. Check the leaderboard!",
        variant: "destructive",
      });
      return;
    }
    setScore(0);
    setCurrentQuestionIndex(0);
    setNewlyAwardedBadges([]);
    await setupGame();
    setGameState("payment");
  };

  const handlePaymentConfirm = () => {
    if (questions.length > 0) {
      setGameState("quiz");
    } else {
       toast({
        title: "Quiz not ready",
        description: "The quiz questions are still being generated. Please wait a moment.",
        variant: "destructive",
      });
    }
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
    // We go back to start, and the useEffect will re-check if they can play.
    // Since they just finished, hasPlayedThisWeek will become true.
  };

  const renderGameState = () => {
    switch (gameState) {
      case "payment":
        return (
          <PaymentScreen
            onConfirm={handlePaymentConfirm}
            onCancel={() => setGameState("start")}
          />
        );
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
        return <ResultScreen score={score} onRestart={handleRestart} playerName={user?.displayName || 'Player'} newlyAwardedBadges={newlyAwardedBadges} />;
      case "start":
      default:
        return <StartScreen onStart={handleStartGame} user={user} loading={loading} hasPlayedThisWeek={hasPlayedThisWeek} checkingForPastScore={checkingForPastScore} isGeneratingQuiz={isGeneratingQuiz} />;
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <SiteHeader />
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
        {renderGameState()}
      </div>
    </main>
  );
}
