'use client';

import { doc, type Firestore, runTransaction, increment, updateDoc } from 'firebase/firestore';
import { startOfWeek, format } from 'date-fns';

export const adjustPrizePool = async (
  db: Firestore,
  adjustmentAmount: number
) => {
    if (typeof adjustmentAmount !== 'number' || isNaN(adjustmentAmount)) {
        throw new Error("Invalid adjustment amount.");
    }
    const today = new Date();
    const weekStartDate = startOfWeek(today, { weekStartsOn: 1 });
    const weekId = format(weekStartDate, 'yyyy-MM-dd');
    const prizePoolRef = doc(db, 'prizePools', weekId);

    try {
        await runTransaction(db, async (transaction) => {
            const prizePoolDoc = await transaction.get(prizePoolRef);

            if (!prizePoolDoc.exists()) {
                 if (adjustmentAmount > 0) {
                    transaction.set(prizePoolRef, {
                        total: adjustmentAmount,
                        startDate: weekStartDate,
                    });
                }
            } else {
                transaction.update(prizePoolRef, { total: increment(adjustmentAmount) });
            }
        });
    } catch (e) {
        console.error("Prize pool adjustment transaction failed: ", e);
        // Re-throw a more user-friendly error
        throw new Error(`Failed to adjust prize pool: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
};

export const updateUserSuspensionStatus = async (
  db: Firestore,
  userId: string,
  isSuspended: boolean
) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, { isSuspended });
  } catch (e) {
    console.error("User suspension update failed: ", e);
    throw new Error(`Failed to update user status: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
};
