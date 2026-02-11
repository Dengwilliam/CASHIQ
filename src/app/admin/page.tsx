'use client';
import SiteHeader from '@/components/site-header';
import { useAdmin } from '@/hooks/useAdmin';
import TransactionsTable from '@/components/admin/transactions-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminPage() {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
        <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <SiteHeader />
            <div className="w-full max-w-6xl animate-in fade-in zoom-in-95 duration-500 mt-24 space-y-8">
                <Skeleton className="h-10 w-64" />
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-96 w-full" />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
  }

  if (!isAdmin) {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <SiteHeader />
            <div className="text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <SiteHeader />
      <div className="w-full max-w-6xl animate-in fade-in zoom-in-95 duration-500 mt-24 space-y-8">
        <header>
            <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">Admin Dashboard</h1>
        </header>
        <TransactionsTable />
      </div>
    </main>
  );
}
