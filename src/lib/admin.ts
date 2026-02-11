'use client';

import { doc, updateDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export const updateTransactionStatus = (
  db: Firestore,
  transactionId: string,
  status: 'approved' | 'rejected'
) => {
  const transactionRef = doc(db, 'payment-transactions', transactionId);
  const dataToUpdate = { status };

  return updateDoc(transactionRef, dataToUpdate)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
        path: transactionRef.path,
        operation: 'update',
        requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw the error so the calling component can handle UI updates (e.g., stop loading state)
        throw serverError;
  });
};
