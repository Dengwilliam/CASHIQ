import { cn } from '@/lib/utils';

export function CashIqLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="CashIQ logo"
      className={cn('h-7 w-7', className)}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 85V71.8M44 17.2V3M59.3 22.4c-4.4-4-10-6.4-16-6.4-6 0-11.6 2.3-16 6.4 -4.2 3.8-6.7 9.2-6.7 15.1 0 5.2 2 10 5.3 13.6" />
        <path d="M28.7 22.4c4.4-4 10-6.4 16-6.4 6 0 11.6 2.3 16 6.4 4.2 3.8 6.7 9.2 6.7 15.1 0 5.2-2 10-5.3 13.6" />
        <path d="M37.6 71.3c-4.8-2.9-8-7.9-8.6-13.6 -1.1-10.4 6.3-19.6 16.3-21.2" />
        <path d="M50.4 71.3c4.8-2.9 8-7.9 8.6-13.6 1.1-10.4-6.3-19.6-16.3-21.2" />
        <path d="M44 71.8c-10.9 0-19.8-10.4-19.8-23.3 0-6.3 2.1-12.2 5.9-16.8" />
        <path d="M44 71.8c10.9 0 19.8-10.4 19.8-23.3 0-6.3-2.1-12.2-5.9-16.8" />
        <path d="M36.1 48.2c-.1-1.3-1.2-2.3-2.5-2.3 -1.4,0-2.5,1-2.5,2.3s1.1,2.3,2.5,2.3h5c1.4,0,2.5-1,2.5-2.3s-1.1-2.3-2.5-2.3" />
        <path d="M33.6 40.5v10.5" />
      </g>
    </svg>
  );
}
