import { Trophy } from 'lucide-react';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';
import AuthButton from '@/components/auth-button';
import WinnerNotification from '@/components/leaderboard/winner-notification';

export const metadata = {
  title: 'Leaderboard | FinChamp',
};

export const revalidate = 300;

export default function LeaderboardPage() {
  
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <WinnerNotification />
      <div className="absolute top-6 left-6 flex items-center gap-2 text-foreground transition-colors hover:text-foreground/80">
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-black">FinChamp</h1>
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <AuthButton />
      </div>
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
