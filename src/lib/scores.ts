'use client';
import { collection, addDoc, serverTimestamp, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type Score = {
  playerName: string;
  score: number;
  userId: string;
};

export const saveScore = (db: Firestore, scoreData: Score) => {
  if (!scoreData.playerName || scoreData.score === undefined || !scoreData.userId) {
    console.error("Attempted to save score with invalid data:", scoreData);
    return;
  }
  const scoresCollection = collection(db, 'scores');
  addDoc(scoresCollection, {
    ...scoreData,
    createdAt: serverTimestamp(),
  }).catch((serverError) => {
    console.error("Firestore save error:", serverError);
    const permissionError = new FirestorePermissionError({
      path: scoresCollection.path,
      operation: 'create',
      requestResourceData: scoreData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};
