import Link from 'next/link';
import { BarChart3, Info, Wallet } from 'lucide-react';
import AuthButton from '@/components/auth-button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { CashIqLogo } from './icons/cash-iq-logo';

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <CashIqLogo className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-bold tracking-tighter">CashIQ</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-2">
                <Link href="/leaderboard" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <BarChart3 className="h-5 w-5" />
                  Leaderboard
                </Link>
                 <Link href="/wallet" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Wallet className="h-5 w-5" />
                  Wallet
                </Link>
                <Link href="/about" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Info className="h-5 w-5" />
                  About
                </Link>
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
                          <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                          </SheetHeader>
                            <nav className="flex flex-col gap-4 py-4">
                                <Button variant="ghost" className="justify-start text-lg" asChild>
                                    <Link href="/leaderboard">
                                        <BarChart3 className="mr-2" />
                                        Leaderboard
                                    </Link>
                                </Button>
                                 <Button variant="ghost" className="justify-start text-lg" asChild>
                                    <Link href="/wallet">
                                        <Wallet className="mr-2" />
                                        Wallet
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
