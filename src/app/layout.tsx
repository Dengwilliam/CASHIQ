import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseProvider } from '@/firebase/provider';
import SiteFooter from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'FinQuiz Challenge',
  description: 'Gamified financial literacy with weekly cash rewards',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full flex flex-col">
        <FirebaseProvider>
          <div className="flex-1">
            {children}
          </div>
          <SiteFooter />
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
