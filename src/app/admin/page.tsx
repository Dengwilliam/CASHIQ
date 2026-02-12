'use client';
import TransactionsTable from '@/components/admin/transactions-table';
import { useAdmin } from '@/hooks/useAdmin';
import UsersTable from '@/components/admin/users-table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 w-full max-w-6xl animate-in fade-in-50 duration-500 space-y-8">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
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
    <div className="container mx-auto px-4 py-8 md:px-6 w-full max-w-6xl animate-in fade-in-50 duration-500 space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
          Admin Dashboard
        </h1>
      </header>
      <TransactionsTable />
      <UsersTable />
    </div>
  );
}
