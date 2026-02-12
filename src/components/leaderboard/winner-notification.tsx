'use client';

import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, type Timestamp } from 'firebase/firestore';
import { subWeeks, startOfWeek, endOfWeek, isMonday } from 'date-fns';

type ScoreWinner = {
  userId: string;
  playerName: string;
  score: number;
  createdAt: Timestamp;
};

// Helper function for rank suffix
const getRankSuffix = (rank: number) => {
  if (rank > 3 && rank < 21) return 'th';
  switch (rank % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export default function WinnerNotification() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore || !user) return;

    const today = new Date();
    const lastWeek = subWeeks(today, 1);
    const startOfLastWeek = startOfWeek(lastWeek, { weekStartsOn: 1 });
    const endOfLastWeek = endOfWeek(lastWeek, { weekStartsOn: 1 });
    
    const winnerNotificationKey = `winner_notification_${startOfLastWeek.toISOString()}`;
    const resultsOutNotificationKey = `results_out_notification_${startOfLastWeek.toISOString()}`;

    // "Weekly results are out!" notification
    if (isMonday(today) && !localStorage.getItem(resultsOutNotificationKey)) {
        toast({
            title: 'Weekly Results Are Out!',
            description: "Check out last week's final leaderboard to see who won.",
            duration: 10000,
        });
        localStorage.setItem(resultsOutNotificationKey, 'true');
    }

    const checkAndNotify = async () => {
      // 1. Check if notification was already shown
      if (localStorage.getItem(winnerNotificationKey)) {
        return;
      }

      // 2. Fetch last week's winners
      const scoresQuery = query(
        collection(firestore, 'scores'),
        where('createdAt', '>=', startOfLastWeek),
        where('createdAt', '<=', endOfLastWeek)
      );

      try {
        const querySnapshot = await getDocs(scoresQuery);
        const scores: ScoreWinner[] = [];
        querySnapshot.forEach((doc) => {
          scores.push(doc.data() as ScoreWinner);
        });
        
        // 3. Sort client-side to find winners
        const winners = scores.sort((a, b) => {
          if (a.score !== b.score) {
            return b.score - a.score;
          }
          return a.createdAt.toMillis() - b.createdAt.toMillis();
        }).slice(0, 4);
        
        // 4. Check if current user is a winner
        const winnerIndex = winners.findIndex(winner => winner.userId === user.uid);

        if (winnerIndex !== -1 && user.email) {
          const currentUserWinner = winners[winnerIndex];
          const rank = winnerIndex + 1;
          const rankSuffix = getRankSuffix(rank);

          // 5. Show toast notification
          toast({
            title: 'Congratulations! You\'re a Winner!',
            description: `You ranked ${rank}${rankSuffix} on last week\'s leaderboard with a score of ${currentUserWinner.score}. Your prize has been credited.`,
            duration: 10000,
          });

          // Also send an email
          const subject = "Congratulations! You're a CapitalQuiz Winner!";
          const htmlBody = `
              <p>Hello ${user.displayName},</p>
              <p>Congratulations! You ranked <strong>${rank}${rankSuffix}</strong> on last week's CapitalQuiz leaderboard with an amazing score of ${currentUserWinner.score}.</p>
              <p>Your prize money should be sent to your registered MoMo number shortly. Keep an eye out for it!</p>
              <p>Thanks for playing,<br/>The CapitalQuiz Challenge Team</p>
          `;
          fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ to: user.email, subject, htmlBody })
          }).catch(e => console.error("Email fetch failed:", e));


          // 6. Mark notification as shown
          localStorage.setItem(winnerNotificationKey, 'true');
        }
      } catch (error) {
        // This might fail if the index is not created yet. We can fail silently.
        console.error("Could not check for winner notification:", error);
      }
    };

    checkAndNotify();

  }, [firestore, user, toast]);


  return null; // This component does not render anything
}
