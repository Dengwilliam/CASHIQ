'use client';
import { useAdmin } from '@/hooks/useAdmin';
import UsersTable from '@/components/admin/users-table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardAnalytics from '@/components/admin/dashboard-analytics';
import PrizePoolManagement from '@/components/admin/prize-pool-management';

export default function AdminPage() {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 w-full max-w-7xl animate-in fade-in-50 duration-500 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 w-full max-w-7xl animate-in fade-in-50 duration-500 space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
          Admin Dashboard
        </h1>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
            <DashboardAnalytics />
        </div>
        <div className="space-y-8">
            <PrizePoolManagement />
            <UsersTable />
        </div>
      </main>
    </div>
  );
}
