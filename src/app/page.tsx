"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, type Timestamp, doc, updateDoc, arrayUnion, getDoc, serverTimestamp, type DocumentData } from 'firebase/firestore';
import { startOfWeek, endOfWeek, isMonday, isSameWeek, subWeeks } from 'date-fns';

import StartScreen from "@/components/quiz/start-screen";
import QuizScreen from "@/components/quiz/quiz-screen";
import ResultScreen from "@/components/quiz/result-screen";
import type { Question, Answer } from "@/lib/questions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { saveScore } from "@/lib/scores";
import SiteHeader from "@/components/site-header";
import { generateQuiz } from "@/ai/flows/generate-quiz-flow";
import { generateExplanation } from "@/ai/flows/generate-explanation-flow";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


type GameState = "start" | "quiz" | "results";

type AnsweredQuestion = {
  question: Question;
  selectedAnswer: Answer;
  isCorrect: boolean;
  explanation: string | null;
};

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
  const [hasApprovedPaymentThisWeek, setHasApprovedPaymentThisWeek] = useState<boolean | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [newlyAwardedBadges, setNewlyAwardedBadges] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [hotStreak, setHotStreak] = useState(0);
  const [maxHotStreak, setMaxHotStreak] = useState(0);


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
      setGameState("quiz");
    } catch (error) {
        console.error("Failed to generate AI quiz:", error);
        toast({
            title: "Error",
            description: "Could not generate a new quiz. Please try again.",
            variant: "destructive",
        });
        setGameState("start");
    } finally {
        setIsGeneratingQuiz(false);
    }
  }, [toast]);

  useEffect(() => {
    const processEndGame = async () => {
      if (!firestore || !user) return;
  
      // 1. Save the current score and wait for it to complete
      await saveScore(firestore, {
        playerName: user.displayName || 'Anonymous',
        score,
        userId: user.uid,
      });
  
      const newBadges: string[] = [];
      const userRef = doc(firestore, 'users', user.uid);
      let userProfileData: DocumentData | null = null;
      let existingBadges: string[] = [];
  
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          userProfileData = userDoc.data();
          existingBadges = userProfileData?.badges || [];
        }
      } catch (e) {
        console.error('Could not fetch user profile for badge check', e);
      }
  
      // --- BADGE LOGIC ---
  
      // 2. Score-based badges
      if (score >= 80) newBadges.push('Finance Whiz');
      if (score === 100) newBadges.push('Perfect Score');
  
      // 3. Hot Streak badge
      if (maxHotStreak >= 5) newBadges.push('Hot Streak');
  
      // 4. Comeback Kid badge
      const scoresQuery = query(
        collection(firestore, 'scores'),
        where('userId', '==', user.uid)
      );
      try {
        const querySnapshot = await getDocs(scoresQuery);
        if (querySnapshot.docs.length > 1) {
            const allScores = querySnapshot.docs.map(doc => ({ score: doc.data().score, createdAt: doc.data().createdAt as Timestamp }));
            allScores.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
            const previousScores = allScores.slice(1);
            if (previousScores.length > 0) {
                const previousHighScore = Math.max(...previousScores.map(s => s.score));
                if (score > previousHighScore) {
                    newBadges.push('Comeback Kid');
                }
            }
        }
      } catch (e) {
        console.error('Could not check for past scores for Comeback Kid badge', e);
      }
  
      // 5. Weekly Warrior badge & update play history
      let consecutiveWeeksPlayed = userProfileData?.consecutiveWeeksPlayed || 0;
      const lastPlayTimestamp = userProfileData?.lastPlayTimestamp;
      const today = new Date();
  
      if (lastPlayTimestamp) {
        const lastPlayDate = (lastPlayTimestamp as Timestamp).toDate();
        const lastWeek = subWeeks(today, 1);
        if (isSameWeek(lastPlayDate, lastWeek, { weekStartsOn: 1 })) {
          consecutiveWeeksPlayed += 1;
        } else if (!isSameWeek(lastPlayDate, today, { weekStartsOn: 1 })) {
          consecutiveWeeksPlayed = 1; // Reset if they missed a week
        }
      } else {
        consecutiveWeeksPlayed = 1; // First time playing
      }
  
      if (consecutiveWeeksPlayed >= 3) {
        newBadges.push('Weekly Warrior');
      }
  
      // --- END BADGE LOGIC ---
  
      // Filter out badges the user already has
      const uniqueNewBadges = newBadges.filter((b) => !existingBadges.includes(b));
  
      if (uniqueNewBadges.length > 0) {
        setNewlyAwardedBadges(uniqueNewBadges);
      }
  
      // Update user profile with new badges and play history
      try {
        const updateData: { [key: string]: any } = {
          lastPlayTimestamp: serverTimestamp(),
          consecutiveWeeksPlayed,
        };
        if (uniqueNewBadges.length > 0) {
          updateData.badges = arrayUnion(...uniqueNewBadges);
        }
  
        updateDoc(userRef, updateData).catch(e => {
            console.error('Failed to update user profile with badges/history', e);
             const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: updateData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
      } catch (e) {
        console.error('Failed to prepare user profile update', e);
      }
  
      // After saving the score, mark that the user has played this week
      setHasPlayedThisWeek(true);
    };
  
    if (gameState === 'results') {
      processEndGame();
    }
  }, [gameState, firestore, user, score, maxHotStreak]);

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
    const checkUserPayment = async () => {
        if (!firestore || !user) {
            setHasApprovedPaymentThisWeek(false);
            setIsCheckingPayment(false);
            return;
        }
        setIsCheckingPayment(true);

        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 });
        const end = endOfWeek(today, { weekStartsOn: 1 });

        const paymentsQuery = query(
            collection(firestore, 'users', user.uid, 'payment-transactions'),
            where('status', '==', 'approved')
        );

        try {
            const querySnapshot = await getDocs(paymentsQuery);
            const approvedPaymentsThisWeek = querySnapshot.docs.filter(doc => {
                const paymentData = doc.data();
                if (paymentData.createdAt) {
                    const paymentDate = (paymentData.createdAt as Timestamp).toDate();
                    return paymentDate >= start && paymentDate <= end;
                }
                return false;
            });
            setHasApprovedPaymentThisWeek(approvedPaymentsThisWeek.length > 0);
        } catch (error) {
            console.error("Error checking for approved payment:", error);
            setHasApprovedPaymentThisWeek(false);
        } finally {
            setIsCheckingPayment(false);
        }
    };

    checkUserPayment();
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
    if (!hasApprovedPaymentThisWeek) {
      toast({
        title: "Payment Not Approved",
        description: "Your entry fee for this week has not been approved yet. Please check your wallet.",
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
    setAnsweredQuestions([]);
    setHotStreak(0);
    setMaxHotStreak(0);
    await setupGame();
  };

  const handleAnswer = async (answer: Answer) => {
    const isCorrect = answer.isCorrect;
    const currentQuestion = questions[currentQuestionIndex];
    if (isCorrect) {
      setScore((prev) => prev + 10);
      const newHotStreak = hotStreak + 1;
      setHotStreak(newHotStreak);
      setMaxHotStreak(prevMax => Math.max(prevMax, newHotStreak));
    } else {
      setHotStreak(0);
    }

    let explanation: string | null = null;
    if (!isCorrect) {
      try {
        const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);
        if (correctAnswer) {
          const result = await generateExplanation({
            question: currentQuestion.text,
            userAnswer: answer.text,
            correctAnswer: correctAnswer.text
          });
          explanation = result.explanation;
        }
      } catch(e) {
        console.error("Error generating explanation:", e);
        explanation = "There was an error generating an explanation for this question.";
      }
    }

    setAnsweredQuestions(prev => [
      ...prev,
      {
        question: currentQuestion,
        selectedAnswer: answer,
        isCorrect,
        explanation
      }
    ]);

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
        return <ResultScreen 
                  score={score} 
                  onRestart={handleRestart} 
                  playerName={user?.displayName || 'Player'} 
                  newlyAwardedBadges={newlyAwardedBadges} 
                  answeredQuestions={answeredQuestions}
               />;
      case "start":
      default:
        return <StartScreen 
                  onStart={handleStartGame} 
                  user={user} 
                  loading={loading} 
                  hasPlayedThisWeek={hasPlayedThisWeek} 
                  checkingForPastScore={checkingForPastScore} 
                  isGeneratingQuiz={isGeneratingQuiz}
                  hasApprovedPaymentThisWeek={hasApprovedPaymentThisWeek}
                  isCheckingPayment={isCheckingPayment} 
                />;
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
