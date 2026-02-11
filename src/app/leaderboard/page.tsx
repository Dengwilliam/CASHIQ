import SiteHeader from '@/components/site-header';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';
import WinnerNotification from '@/components/leaderboard/winner-notification';

export const metadata = {
  title: 'Leaderboard | FinQuiz Challenge',
};

export const revalidate = 300;

export default function LeaderboardPage() {
  
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <WinnerNotification />
      <SiteHeader />
      <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500 mt-24">
        <LeaderboardTable />
      </div>
      <CardFooter className="mt-4">
        <Button asChild>
            <Link href="/">Play Again</Link>
        </Button>
      </CardFooter>
    </main>
  );
}
