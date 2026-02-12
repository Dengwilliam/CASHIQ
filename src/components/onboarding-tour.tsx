'use client';

import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Wallet, HelpCircle, BarChart, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type OnboardingTourProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

const tourSteps = [
  {
    icon: PartyPopper,
    title: 'Welcome to FinQuiz Challenge!',
    description: "Let's quickly walk through how everything works.",
  },
  {
    icon: Wallet,
    title: '1. Fund Your Wallet',
    description: 'Each week, you pay a small entry fee to join the quiz. You can add funds and manage your payments in your Wallet.',
  },
  {
    icon: HelpCircle,
    title: '2. Take the Weekly Quiz',
    description: 'Once your payment is approved, you can take the quiz right from the home screen. Answer questions to earn points!',
  },
  {
    icon: BarChart,
    title: '3. Climb the Leaderboard',
    description: 'Your score will be added to the weekly leaderboard. The top 4 players win a share of the total prize pool!',
  },
];

export default function OnboardingTour({ open, onOpenChange }: OnboardingTourProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentStep(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api]);

  const handleFinish = async () => {
    if (!user || !firestore) return;
    setIsFinishing(true);
    const userRef = doc(firestore, 'users', user.uid);
    const dataToUpdate = { hasCompletedOnboarding: true };

    try {
      await setDoc(userRef, dataToUpdate, { merge: true });
      toast({
        title: "You're all set!",
        description: 'Good luck in the quiz!',
      });
      onOpenChange(false);
    } catch (serverError) {
      const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: dataToUpdate,
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({
        title: 'Error',
        description: 'Could not save your progress. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Quick Guide</DialogTitle>
        </DialogHeader>
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {tourSteps.map((step, index) => (
              <CarouselItem key={index}>
                <div className="p-1 text-center">
                  <div className="flex aspect-square items-center justify-center p-6">
                     <step.icon className="h-20 w-20 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
                  <p className="text-muted-foreground mt-2">{step.description}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
         <div className="flex justify-center items-center gap-2 mt-2">
            {tourSteps.map((_, index) => (
                <div key={index} className={`h-2 w-2 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-muted'}`} />
            ))}
        </div>
        <DialogFooter className="mt-4">
          {currentStep === tourSteps.length - 1 ? (
            <Button onClick={handleFinish} className="w-full" disabled={isFinishing}>
              {isFinishing ? 'Finishing...' : 'Let\'s Go!'}
            </Button>
          ) : (
             <Button onClick={() => api?.scrollNext()} className="w-full">
                Next
             </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
