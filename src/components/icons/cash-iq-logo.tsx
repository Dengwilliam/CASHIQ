import { cn } from '@/lib/utils';

export function CashIqLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="CashIQ logo"
      className={cn('h-7 w-7', className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10a9.96 9.96 0 0 0 7.35-3.22c-1.43-1.13-2.35-2.81-2.35-4.78s.92-3.65 2.35-4.78A9.96 9.96 0 0 0 12 2zm1.5 13.5h-2v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V15h-.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5h.5V8.75c0-.41.34-.75.75-.75s.75.34.75.75V10h2c1.38 0 2.5 1.12 2.5 2.5S14.88 15 13.5 15zm-2-2.5h-1V11h1v1.5zm2-3h-2V8h2v1.5z"
      />
    </svg>
  );
}
