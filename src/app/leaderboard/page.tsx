'use client';

import { useState } from 'react';
import { startOfWeek, endOfWeek, subWeeks, addWeeks, isSameWeek } from 'date-fns';

import SiteHeader from '@/components/site-header';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import WinnerNotification from '@/components/leaderboard/winner-notification';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <WinnerNotification />
      <SiteHeader />
      <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500 mt-24 space-y-8">
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handlePreviousWeek}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week
            </Button>
            <Button variant="outline" onClick={handleNextWeek} disabled={isCurrentWeek}>
                Next Week <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
        <LeaderboardTable week={selectedWeek} />
      </div>
      <div className="mt-8 text-center">
        <Button asChild>
            <Link href="/">Play Again</Link>
        </Button>
      </div>
    </main>
  );
}
