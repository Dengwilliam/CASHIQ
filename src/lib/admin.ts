'use client';

import { doc, type Firestore, runTransaction, increment, updateDoc, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { startOfWeek, format } from 'date-fns';

const SSP_TO_COIN_CONVERSION_RATE = 1000 / 25000; // 1000 coins for 25000 SSP

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
        const coinsToAdd = Math.round(txData.amount * SSP_TO_COIN_CONVERSION_RATE);
        transaction.update(userRef, {
          coins: increment(coinsToAdd)
        });
      }
    });
  } catch (e) {
    console.error("Transaction status update failed:", e);
    throw new Error(`Failed to update transaction: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
};

export const deleteUser = async (
  db: Firestore,
  userId: string
) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const batch = writeBatch(db);

  // 1. Delete user document
  const userRef = doc(db, 'users', userId);
  batch.delete(userRef);

  // 2. Delete user's scores
  const scoresQuery = query(collection(db, 'scores'), where('userId', '==', userId));
  const scoresSnapshot = await getDocs(scoresQuery);
  scoresSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  // 3. Delete user's payment transactions (subcollection)
  const transactionsQuery = collection(db, `users/${userId}/payment-transactions`);
  const transactionsSnapshot = await getDocs(transactionsQuery);
  transactionsSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  // Note: This does not delete the user from Firebase Authentication as that requires
  // the Admin SDK, which is not available on the client. The user's login will remain,
  // but all their app-specific data will be gone.

  await batch.commit();
};
