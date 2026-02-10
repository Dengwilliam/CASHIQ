import { BarChartHorizontal } from 'lucide-react';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';

export const metadata = {
  title: 'Leaderboard | FinQuiz Challenge',
};

export const revalidate = 300;

export default function LeaderboardPage() {
  
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8">
      <div className="absolute top-6 left-6 flex items-center gap-2 text-foreground/80">
        <Link href="/" className="flex items-center gap-2">
          <BarChartHorizontal className="h-6 w-6" />
          <h1 className="text-lg font-semibold">FinQuiz Challenge</h1>
        </Link>
      </div>
      <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500">
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
