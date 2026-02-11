import SiteHeader from '@/components/site-header';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import WinnerNotification from '@/components/leaderboard/winner-notification';
import LastWeeksWinners from '@/components/leaderboard/last-weeks-winners';

export const metadata = {
  title: 'Leaderboard | FinQuiz Challenge',
};

export const revalidate = 300;

export default function LeaderboardPage() {
  
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <WinnerNotification />
      <SiteHeader />
      <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500 mt-24 space-y-8">
        <LeaderboardTable />
        <LastWeeksWinners />
      </div>
      <div className="mt-8 text-center">
        <Button asChild>
            <Link href="/">Play Again</Link>
        </Button>
      </div>
    </main>
  );
}
