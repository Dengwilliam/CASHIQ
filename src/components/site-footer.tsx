'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Twitter, Facebook, Instagram } from 'lucide-react';

export default function SiteFooter() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-border/20 mt-12 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {year} CashIQ. All rights reserved.
        </p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
          </nav>
          <div className="flex gap-4">
             <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
             <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
             <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
