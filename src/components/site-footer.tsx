'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SiteFooter() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-border/20 mt-12 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {year} FinQuiz Challenge. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
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
      </div>
    </footer>
  );
}
