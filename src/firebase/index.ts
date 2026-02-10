'use client';

import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useCollection, useMemoFirebase } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';


export function initializeFirebase() {
    // This function is deprecated and the logic is now in the provider.
    // It is kept for compatibility but should not be used.
    console.warn("initializeFirebase from firebase/index.ts is deprecated. Firebase is initialized in FirebaseProvider.");
    return {} as any;
}

export {
    FirebaseProvider,
    FirebaseClientProvider,
    useCollection,
    useDoc,
    useUser,
    useFirebase,
    useFirebaseApp,
    useAuth,
    useFirestore,
    useMemoFirebase,
};
