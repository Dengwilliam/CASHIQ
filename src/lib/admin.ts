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


export const updateTransactionStatus = async (
  db: Firestore,
  userId: string,
  transactionId: string,
  status: 'approved' | 'rejected'
) => {
  if (!userId || !transactionId) {
    throw new Error("User ID and Transaction ID are required.");
  }
  
  const userRef = doc(db, 'users', userId);
  const transactionRef = doc(db, `users/${userId}/payment-transactions`, transactionId);

  try {
    await runTransaction(db, async (transaction) => {
      const txDoc = await transaction.get(transactionRef);
      if (!txDoc.exists()) {
        throw new Error("Transaction not found.");
      }

      const txData = txDoc.data();
      
      // Prevent re-processing
      if (txData.status !== 'pending') {
          throw new Error(`Transaction is already ${txData.status}.`);
      }

      transaction.update(transactionRef, { status });

      if (status === 'approved') {
        transaction.update(userRef, {
          coins: increment(txData.amount)
        });
      }
    });
  } catch (e) {
    console.error("Transaction status update failed:", e);
    throw new Error(`Failed to update transaction: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
};
