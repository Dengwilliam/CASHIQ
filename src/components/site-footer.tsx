'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Twitter, Facebook, Instagram } from 'lucide-react';
import { CashIqLogo } from './icons/cash-iq-logo';

export default function SiteFooter() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-border/20 mt-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-12">
        <div className="flex flex-col items-center md:items-start gap-4">
           <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <CashIqLogo className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-bold tracking-tighter">CashIQ</h1>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
                Empowering people to learn finance through fun, competition, and rewards.
            </p>
             <p className="text-sm text-muted-foreground">
                &copy; {year} CashIQ. All rights reserved.
            </p>
        </div>
        <div className="flex flex-col items-center md:items-start gap-4">
             <h3 className="text-lg font-semibold">Quick Links</h3>
             <nav className="flex flex-col gap-2 items-center md:items-start">
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About Us
                </Link>
                <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Leaderboard
                </Link>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    My Profile
                </Link>
            </nav>
        </div>
        <div className="flex flex-col items-center md:items-start gap-4">
             <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
                <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></a>
                <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></a>
                <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></a>
            </div>
        </div>
      </div>
    </footer>
  );
}
