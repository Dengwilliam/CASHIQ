'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

type PaymentScreenProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

const ENTRY_FEE = "25,000 SSP";

const MtnMomoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="100" cy="100" r="100" fill="#FFCC00"/>
        <path d="M62.5 137.5V62.5L100 106.25L137.5 62.5V137.5" stroke="white" strokeWidth="12.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default function PaymentScreen({ onConfirm, onCancel }: PaymentScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call to MTN MoMo
    setTimeout(() => {
      // On successful payment confirmation from backend
      onConfirm();
    }, 2500); // Simulate a 2.5 second delay
  };

  return (
    <Card className="text-center bg-card/60 backdrop-blur-xl border-primary/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Confirm Entry Fee</CardTitle>
        <CardDescription className="pt-2 text-base">
          Please confirm the payment to start the quiz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground">Entry Fee</p>
          <p className="text-4xl font-bold text-primary">{ENTRY_FEE}</p>
        </div>
        <p className="text-xs text-muted-foreground">
            You will be prompted to enter your PIN on your mobile phone to authorize the payment.
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button 
          onClick={handlePayment} 
          className="w-full bg-[#FFCC00] text-black hover:bg-[#FFCC00]/90" 
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <MtnMomoIcon className="mr-2" />
              Pay with MTN MoMo
            </>
          )}
        </Button>
        <Button onClick={onCancel} className="w-full" size="lg" variant="ghost" disabled={isProcessing}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
