'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result on page load
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This is the successfully signed-in user.
          const user = result.user;
          // Create or update user profile in Firestore
          if (user) {
            const userRef = doc(firestore, 'users', user.uid);
            const userData = {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            };
            setDoc(userRef, userData, { merge: true })
              .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                  path: userRef.path,
                  operation: 'update',
                  requestResourceData: userData,
                });
                errorEmitter.emit('permission-error', permissionError);
              });
          }
        }
      })
      .catch((error) => {
        console.error("Google Redirect Sign-In Error:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, loading };
}
