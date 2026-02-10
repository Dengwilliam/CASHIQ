'use client';

import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { Trophy } from 'lucide-react';

type ScoreWinner = {
  userId: string;
  playerName: string;
  score: number;
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
    
    const notificationKey = `winner_notification_${startOfLastWeek.toISOString()}`;

    const checkAndNotify = async () => {
      // 1. Check if notification was already shown
      if (localStorage.getItem(notificationKey)) {
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
        const currentUserWinner = winners.find(winner => winner.userId === user.uid);

        if (currentUserWinner) {
          // 4. Show toast notification
          toast({
            title: 'Congratulations! You\'re a Winner!',
            description: `You placed on last week's leaderboard with a score of ${currentUserWinner.score}. Your prize has been credited.`,
            duration: 10000, // 10 seconds
          });

          // 5. Mark notification as shown
          localStorage.setItem(notificationKey, 'true');
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
