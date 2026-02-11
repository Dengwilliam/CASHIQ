'use client';

import { doc, updateDoc, getDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export const updateTransactionStatus = async (
  db: Firestore,
  userId: string,
  transactionId: string,
  status: 'approved' | 'rejected'
) => {
  const transactionRef = doc(db, 'users', userId, 'payment-transactions', transactionId);
  const dataToUpdate = { status };

  try {
    await updateDoc(transactionRef, dataToUpdate);

    // After successful update, send an email notification.
    // This is a "fire-and-forget" call so it doesn't block the admin UI.
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

        const subject = `Your FinQuiz Payment has been ${status}`;
        const htmlBody = `
            <p>Hello ${userData.displayName},</p>
            <p>Your payment for the FinQuiz Challenge (Transaction ID: ${transactionData.momoTransactionId}) has been <strong>${status}</strong>.</p>
            ${status === 'approved' ? '<p>You can now head to the app and play this week\'s quiz. Good luck!</p>' : '<p>If you believe this was a mistake, please contact support.</p>'}
            <p>Thanks,<br/>The FinQuiz Challenge Team</p>
        `;

        // Send the email via our API route
        fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: userData.email, subject, htmlBody })
        }).catch(e => console.error("Email API fetch failed:", e));

      })
      .catch(e => console.error("Failed to prepare and send status email:", e));

  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: transactionRef.path,
      operation: 'update',
      requestResourceData: dataToUpdate,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the error so the calling component can handle UI updates
    throw serverError;
  }
};
