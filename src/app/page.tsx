"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, type Timestamp, doc, updateDoc, arrayUnion, getDoc, serverTimestamp, type DocumentData, increment, runTransaction } from 'firebase/firestore';
import { startOfWeek, endOfWeek, isMonday, isSameWeek, subWeeks, isToday, format } from 'date-fns';

import StartScreen from "@/components/quiz/start-screen";
import QuizScreen from "@/components/quiz/quiz-screen";
import ResultScreen from "@/components/quiz/result-screen";
import type { Question, Answer } from "@/lib/questions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { saveScore } from "@/lib/scores";
import { generateQuiz } from "@/ai/flows/generate-quiz-flow";
import { generateExplanation } from "@/ai/flows/generate-explanation-flow";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import OnboardingTour from "@/components/onboarding-tour";
import { useDoc } from "@/firebase/firestore/use-doc";
import type { UserProfile } from "@/lib/user-profile";
import { useAdmin } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


type GameState = "start" | "quiz" | "results";
type QuizType = "weekly" | "daily";

type AnsweredQuestion = {
  question: Question;
  selectedAnswer: Answer;
  isCorrect: boolean;
  explanation: string | null;
};

const WEEKLY_QUESTIONS_PER_GAME = 20;
const DAILY_QUESTIONS_PER_GAME = 5;
const COINS_PER_CORRECT_ANSWER = 5;
const WEEKLY_ENTRY_COIN_COST = 1000;
const WEEKLY_PRIZE_CONTRIBUTION = 25000; // SSP equivalent of 1000 coins


// Utility to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasPlayedThisWeek, setHasPlayedThisWeek] = useState<boolean | null>(null);
  const [checkingForPastScore, setCheckingForPastScore] = useState(true);
  const [hasPlayedDailyToday, setHasPlayedDailyToday] = useState<boolean | null>(null);
  const [isCheckingDaily, setIsCheckingDaily] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [newlyAwardedBadges, setNewlyAwardedBadges] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [hotStreak, setHotStreak] = useState(0);
  const [maxHotStreak, setMaxHotStreak] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [lastGameReward, setLastGameReward] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);


  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (!userLoading && !adminLoading && isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, userLoading, adminLoading, router]);

  useEffect(() => {
    // Check if onboarding tour should be shown for new users.
    if (user && userProfile && userProfile.hasCompletedOnboarding === false && !profileLoading) {
      // Use a timeout to avoid showing the dialog immediately on page load, which can be jarring.
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, userProfile, profileLoading]);

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

  const setupWeeklyQuiz = useCallback(async () => {
    // isGeneratingQuiz is set true before calling this
    try {
      const quizOutput = await generateQuiz({ count: WEEKLY_QUESTIONS_PER_GAME, difficulty: 'medium' });
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
      if (!firestore || !user || !quizType) return;
  
      if (quizType === 'weekly') {
        const finalScore = isDisqualified ? 0 : score;
        setLastGameReward(finalScore);
        
        // 1. Save the current score and wait for it to complete
        await saveScore(firestore, {
          playerName: user.displayName || 'Anonymous',
          score: finalScore,
          userId: user.uid,
        });
        
        // Don't award badges or process streaks if disqualified
        if(isDisqualified) {
            setHasPlayedThisWeek(true);
            return;
        }

        const newBadges: string[] = [];
        const userRef = doc(firestore, 'users', user.uid);
        let userProfileData: DocumentData | null = null;
        let existingBadges: string[] = [];
    
        const userDoc = await getDoc(userRef).catch(e => {
            const permissionError = new FirestorePermissionError({ path: userRef.path, operation: 'get' });
            errorEmitter.emit('permission-error', permissionError);
            return null;
        });

        if (userDoc && userDoc.exists()) {
            userProfileData = userDoc.data();
            existingBadges = userProfileData?.badges || [];
        }
    
        // --- BADGE LOGIC ---
        if (finalScore >= 80) newBadges.push('Finance Whiz');
        if (finalScore === 100) newBadges.push('Perfect Score');
        if (maxHotStreak >= 5) newBadges.push('Hot Streak');
    
        const scoresQuery = query(
          collection(firestore, 'scores'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(scoresQuery).catch(e => {
            const permissionError = new FirestorePermissionError({ path: 'scores', operation: 'list' });
            errorEmitter.emit('permission-error', permissionError);
            return null;
        });

        if (querySnapshot && querySnapshot.docs.length > 1) {
            const allScores = querySnapshot.docs.map(doc => ({ score: doc.data().score, createdAt: doc.data().createdAt as Timestamp }));
            allScores.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
            const previousScores = allScores.slice(1);
            if (previousScores.length > 0) {
                const previousHighScore = Math.max(...previousScores.map(s => s.score));
                if (finalScore > previousHighScore) {
                    newBadges.push('Comeback Kid');
                }
            }
        }
    
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
    
        const uniqueNewBadges = newBadges.filter((b) => !existingBadges.includes(b));
    
        if (uniqueNewBadges.length > 0) {
          setNewlyAwardedBadges(uniqueNewBadges);
        }
    
        try {
          const updateData: { [key: string]: any } = {
            lastPlayTimestamp: serverTimestamp(),
            consecutiveWeeksPlayed,
          };
          if (uniqueNewBadges.length > 0) {
            updateData.badges = arrayUnion(...uniqueNewBadges);
          }
    
          updateDoc(userRef, updateData).catch(e => {
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
        setHasPlayedThisWeek(true);
      } else if (quizType === 'daily') {
        const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
        const coinsEarned = correctAnswers * COINS_PER_CORRECT_ANSWER;
        setLastGameReward(coinsEarned);

        const userRef = doc(firestore, 'users', user.uid);
        const updateData: { [key: string]: any } = {
            lastDailyPlayTimestamp: serverTimestamp(),
        };
        if (coinsEarned > 0) {
            updateData.coins = increment(coinsEarned);
        }

        await updateDoc(userRef, updateData).catch(e => {
             const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: { coins: `increment(${coinsEarned})`, lastDailyPlayTimestamp: 'SERVER_TIMESTAMP'},
            });
            errorEmitter.emit('permission-error', permissionError);
        });

        setHasPlayedDailyToday(true);
      }
    };
  
    if (gameState === 'results') {
      processEndGame();
    }
  }, [gameState, firestore, user, score, maxHotStreak, quizType, answeredQuestions, userProfile, isDisqualified]);

  useEffect(() => {
    const checkUserScore = () => {
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

      getDocs(scoresQuery).then(querySnapshot => {
        const scoresThisWeek = querySnapshot.docs.filter(doc => {
            const scoreData = doc.data();
            if (scoreData.createdAt) {
                const scoreDate = (scoreData.createdAt as Timestamp).toDate();
                return scoreDate >= start && scoreDate <= end;
            }
            return false;
        });
        setHasPlayedThisWeek(scoresThisWeek.length > 0);
      }).catch(error => {
        const permissionError = new FirestorePermissionError({
            path: 'scores',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setHasPlayedThisWeek(false);
      }).finally(() => {
        setCheckingForPastScore(false);
      });
    };

    checkUserScore();
  }, [user, firestore, gameState]);

  useEffect(() => {
    const checkUserDailyPlay = async () => {
        if (!user || !userProfile) {
            setHasPlayedDailyToday(null);
            setIsCheckingDaily(false);
            return;
        }
        setIsCheckingDaily(true);
        if (userProfile.lastDailyPlayTimestamp) {
            const lastPlayDate = (userProfile.lastDailyPlayTimestamp as Timestamp).toDate();
            setHasPlayedDailyToday(isToday(lastPlayDate));
        } else {
            setHasPlayedDailyToday(false);
        }
        setIsCheckingDaily(false);
    };

    if (!profileLoading) {
      checkUserDailyPlay();
    }
  }, [user, userProfile, profileLoading, gameState]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only apply anti-cheat to weekly quiz
      if (document.hidden && gameState === "quiz" && quizType === 'weekly') {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);

        if (newCount === 1) {
           toast({
              title: "Warning: Cheating is not allowed",
              description: "Switching tabs again will result in disqualification and a score of 0.",
              variant: "destructive",
              duration: 7000,
            });
        } else if (newCount >= 2) {
           toast({
              title: "Disqualified",
              description: "You have been disqualified for switching tabs. Your score is 0.",
              variant: "destructive",
              duration: 9000,
            });
            setScore(0);
            setIsDisqualified(true);
            setGameState("results");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gameState, toast, tabSwitchCount, quizType]);

  const handleStartWeeklyQuiz = async () => {
    if (!user || !firestore) {
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
    if ((userProfile?.coins ?? 0) < WEEKLY_ENTRY_COIN_COST) {
        toast({
            title: 'Not enough coins',
            description: `You need ${WEEKLY_ENTRY_COIN_COST} coins to enter the weekly challenge.`,
            variant: 'destructive',
        });
        return;
    }

    setIsGeneratingQuiz(true); // To show loading state

    const userRef = doc(firestore, 'users', user.uid);
    const today = new Date();
    const weekStartDate = startOfWeek(today, { weekStartsOn: 1 });
    const weekId = format(weekStartDate, 'yyyy-MM-dd');
    const prizePoolRef = doc(firestore, 'prizePools', weekId);

    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists() || (userDoc.data().coins ?? 0) < WEEKLY_ENTRY_COIN_COST) {
                throw new Error('Insufficient coins.');
            }

            // 1. Decrement user coins
            transaction.update(userRef, { coins: increment(-WEEKLY_ENTRY_COIN_COST) });

            // 2. Increment prize pool
            const prizePoolDoc = await transaction.get(prizePoolRef);
            if (!prizePoolDoc.exists()) {
                transaction.set(prizePoolRef, {
                    total: WEEKLY_PRIZE_CONTRIBUTION,
                    startDate: weekStartDate,
                });
            } else {
                transaction.update(prizePoolRef, { total: increment(WEEKLY_PRIZE_CONTRIBUTION) });
            }
        });

        // If transaction succeeds, start the quiz
        toast({
            title: 'Success!',
            description: 'You have entered the weekly challenge.',
        });

        setScore(0);
        setCurrentQuestionIndex(0);
        setNewlyAwardedBadges([]);
        setAnsweredQuestions([]);
        setHotStreak(0);
        setMaxHotStreak(0);
        setTabSwitchCount(0);
        setIsDisqualified(false);
        setQuizType('weekly');
        await setupWeeklyQuiz();

    } catch (error: any) {
        console.error("Weekly quiz entry transaction failed:", error);
        toast({
            title: "Entry Failed",
            description: error.message || "Could not process your entry. Please try again.",
            variant: "destructive",
        });
        setIsGeneratingQuiz(false);
    }
  };

  const handleStartDailyQuiz = async () => {
    if (!user) {
      toast({ title: "Please log in", description: "You must be logged in to play.", variant: "destructive" });
      return;
    }
    if (hasPlayedDailyToday) {
      toast({ title: "Already Played", description: "You can only play the daily quiz once per day. Come back tomorrow!", variant: "destructive" });
      return;
    }
    setScore(0);
    setCurrentQuestionIndex(0);
    setNewlyAwardedBadges([]);
    setAnsweredQuestions([]);
    setHotStreak(0);
    setMaxHotStreak(0);
    setQuizType('daily');
    
    setIsGeneratingQuiz(true);
    try {
      const quizOutput = await generateQuiz({ count: DAILY_QUESTIONS_PER_GAME, difficulty: 'easy', isDailyChallenge: true });
      const questionsWithShuffledAnswers = quizOutput.questions.map(q => ({
        ...q,
        answers: shuffleArray(q.answers)
      }));
      setQuestions(questionsWithShuffledAnswers);
      setGameState("quiz");
    } catch (error) {
      console.error("Failed to generate daily quiz:", error);
      toast({
        title: "Error",
        description: "Could not generate a new daily quiz. Please try again.",
        variant: "destructive",
      });
      setGameState("start");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleAnswer = async (answer: Answer) => {
    const isCorrect = answer.isCorrect;
    const currentQuestion = questions[currentQuestionIndex];
    if (isCorrect) {
      if (quizType === 'weekly') {
        setScore((prev) => prev + 5);
      }
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
    setQuizType(null);
  };
  
  const renderLoading = () => (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );

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
                  score={isDisqualified ? 0 : lastGameReward}
                  onRestart={handleRestart} 
                  playerName={user?.displayName || 'Player'} 
                  newlyAwardedBadges={newlyAwardedBadges} 
                  answeredQuestions={answeredQuestions}
                  quizType={quizType}
                  isDisqualified={isDisqualified}
               />;
      case "start":
      default:
        return <StartScreen 
                  onStartWeekly={handleStartWeeklyQuiz}
                  onStartDaily={handleStartDailyQuiz}
                  user={user} 
                  loading={userLoading || checkingForPastScore || isCheckingDaily}
                  hasPlayedThisWeek={hasPlayedThisWeek} 
                  isGeneratingQuiz={isGeneratingQuiz}
                  hasPlayedDailyToday={hasPlayedDailyToday}
                  coinBalance={userProfile?.coins ?? 0}
                />;
    }
  };
  
  if (userLoading || adminLoading) {
    return renderLoading();
  }

  if (isAdmin) {
    return renderLoading(); // Or a specific "Redirecting..." message
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      {user && <OnboardingTour open={showOnboarding} onOpenChange={setShowOnboarding} />}
      <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500">
        {renderGameState()}
      </div>
    </div>
  );
}
