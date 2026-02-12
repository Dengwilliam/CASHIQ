import Link from 'next/link';
import { Trophy, BarChart3, Info } from 'lucide-react';
import AuthButton from '@/components/auth-button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <Trophy className="h-7 w-7 text-accent" />
                <h1 className="text-xl font-bold tracking-tighter">CapitalQuiz</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
                <Button variant="ghost" asChild>
                    <Link href="/leaderboard">
                        <BarChart3 />
                        Leaderboard
                    </Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/about">
                        <Info />
                        About
                    </Link>
                </Button>
            </nav>
            <div className="flex items-center gap-2">
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <nav className="flex flex-col gap-4 py-4">
                                <Button variant="ghost" className="justify-start text-lg" asChild>
                                    <Link href="/leaderboard">
                                        <BarChart3 className="mr-2" />
                                        Leaderboard
                                    </Link>
                                </Button>
                                <Button variant="ghost" className="justify-start text-lg" asChild>
                                    <Link href="/about">
                                        <Info className="mr-2" />
                                        About
                                    </Link>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
                <AuthButton />
            </div>
        </div>
    </header>
  );
}
