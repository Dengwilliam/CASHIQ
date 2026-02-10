'use client';

import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { subWeeks, startOfWeek, endOfWeek, isMonday } from 'date-fns';

type ScoreWinner = {
  userId: string;
  playerName: string;
  score: number;
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
        where('createdAt', '<=', endOfLastWeek),
        orderBy('score', 'desc'),
        orderBy('createdAt', 'asc'),
        limit(4)
      );

      try {
        const querySnapshot = await getDocs(scoresQuery);
        const winners: ScoreWinner[] = [];
        querySnapshot.forEach((doc) => {
          winners.push(doc.data() as ScoreWinner);
        });
        
        // 3. Check if current user is a winner
        const winnerIndex = winners.findIndex(winner => winner.userId === user.uid);

        if (winnerIndex !== -1) {
          const currentUserWinner = winners[winnerIndex];
          const rank = winnerIndex + 1;

          // 4. Show toast notification
          toast({
            title: 'Congratulations! You\'re a Winner!',
            description: `You ranked ${rank}${getRankSuffix(rank)} on last week\'s leaderboard with a score of ${currentUserWinner.score}. Your prize has been credited.`,
            duration: 10000,
          });

          // 5. Mark notification as shown
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
