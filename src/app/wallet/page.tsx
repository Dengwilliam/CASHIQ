'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WalletPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 w-full max-w-4xl animate-in fade-in-50 duration-500">
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Feature Not Available</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This feature has been removed.</p>
            </CardContent>
        </Card>
    </div>
  );
}
