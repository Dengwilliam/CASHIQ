import Link from 'next/link';
import { Trophy } from 'lucide-react';
import AuthButton from '@/components/auth-button';

export default function SiteHeader() {
  return (
    <>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-foreground transition-colors hover:text-foreground/80 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
          <h1 className="text-xl sm:text-2xl font-black">CapitalQuiz Challenge</h1>
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <AuthButton />
      </div>
    </>
  );
}
