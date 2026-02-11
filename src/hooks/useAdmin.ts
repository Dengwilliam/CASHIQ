'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useAdmin() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const adminRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'admins', user.uid);
  }, [firestore, user]);

  const { data: adminDoc, loading: adminLoading } = useDoc(adminRef);

  const isAdmin = !!adminDoc;
  const loading = userLoading || adminLoading;

  return { isAdmin, loading };
}
