'use client';

import { doc, getDoc, type Firestore, runTransaction, increment } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { startOfWeek, format } from 'date-fns';

export const updateTransactionStatus = (
  db: Firestore,
  userId: string,
  transactionId: string,
  status: 'approved' | 'rejected'
) => {
  const transactionRef = doc(db, 'users', userId, 'payment-transactions', transactionId);

  return runTransaction(db, async (transaction) => {
    const txDoc = await transaction.get(transactionRef);
    if (!txDoc.exists()) {
      throw "Transaction document does not exist!";
    }
    const txData = txDoc.data();

    // Only process if status is changing
    if (txData.status === status) {
        return;
    }

    const wasApproved = txData.status === 'approved';

    // Update the transaction status
    transaction.update(transactionRef, { status: status });

    // Update the prize pool if it's a cash transaction
    if (txData.entryType === 'cash' && txData.createdAt) {
        const weekStartDate = startOfWeek(txData.createdAt.toDate(), { weekStartsOn: 1 });
        const weekId = format(weekStartDate, 'yyyy-MM-dd');
        const prizePoolRef = doc(db, 'prizePools', weekId);

        let amountChange = 0;
        // If just approved, add amount
        if (status === 'approved' && !wasApproved) {
            amountChange = txData.amount;
        } 
        // If just rejected (from approved), subtract amount
        else if (status === 'rejected' && wasApproved) {
            amountChange = -txData.amount;
        }

        if (amountChange !== 0) {
            const prizePoolDoc = await transaction.get(prizePoolRef);
            if (!prizePoolDoc.exists()) {
                // Don't create a pool for a negative change
                if (amountChange > 0) {
                    transaction.set(prizePoolRef, {
                        total: amountChange,
                        startDate: weekStartDate,
                    });
                }
            } else {
                transaction.update(prizePoolRef, { total: increment(amountChange) });
            }
        }
    }
  })
    .then(() => {
        // After successful update, send an email notification.
        getDoc(transactionRef)
        .then(transactionSnap => {
            if (!transactionSnap.exists()) {
            throw new Error("Transaction doc not found");
            }
            const transactionData = transactionSnap.data();
            const userRef = doc(db, 'users', transactionData.userId);
            return getDoc(userRef).then(userSnap => ({ userSnap, transactionData }));
        })
        .then(result => {
            if (!result || !result.userSnap.exists()) {
            throw new Error("User doc not found for email");
            }

            const { userSnap, transactionData } = result;
            const userData = userSnap.data();

            if (!userData.email) {
                console.error("User does not have an email address. Cannot send notification.");
                return;
            }

            const subject = `Your CashIQ Payment has been ${status}`;
            const htmlBody = `
                <p>Hello ${userData.displayName},</p>
                <p>Your payment for CashIQ (Transaction ID: ${transactionData.momoTransactionId}) has been <strong>${status}</strong>.</p>
                ${status === 'approved' ? '<p>You can now head to the app and play this week\'s quiz. Good luck!</p>' : '<p>If you believe this was a mistake, please contact our support team at <a href="mailto:support@cashiq.com">support@cashiq.com</a>.</p>'}
                <p>Thanks,<br/>The CashIQ Team</p>
            `;

            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: userData.email, subject, htmlBody })
            }).catch(e => console.error("Email API fetch failed:", e));

        })
        .catch(e => console.error("Failed to prepare and send status email:", e));
    })
    .catch((serverError) => {
        // The transaction will automatically be rolled back.
        console.error("Transaction update failed:", serverError);
        // We can throw a generic error for the toast.
        throw new Error(`Failed to update transaction status: ${serverError.message}`);
    });
};
