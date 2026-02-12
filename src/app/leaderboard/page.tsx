'use client';

import { useState } from 'react';
import { startOfWeek, endOfWeek, subWeeks, addWeeks, isSameWeek } from 'date-fns';

import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import WinnerNotification from '@/components/leaderboard/winner-notification';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LastWeeksWinners from '@/components/leaderboard/last-weeks-winners';

export default function LeaderboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePreviousWeek = () => {
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(addWeeks(selectedDate, 1));
  };
  
  const isCurrentWeek = isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 });

  const selectedWeek = {
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 w-full max-w-4xl animate-in fade-in-50 duration-500 space-y-8">
      <WinnerNotification />
      <LastWeeksWinners />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek} disabled={isCurrentWeek}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
      </div>
      <LeaderboardTable week={selectedWeek} />
      <div className="mt-8 text-center">
        <Button asChild size="lg">
            <Link href="/">Play the Quiz!</Link>
        </Button>
      </div>
    </div>
  );
}
