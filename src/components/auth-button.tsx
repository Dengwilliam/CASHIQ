'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { doc, setDoc, type Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

async function handleSignIn(auth: Auth, firestore: Firestore) {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
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

function handleSignOut(auth: Auth) {
  signOut(auth);
}

export default function AuthButton() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  if (loading) {
    return <Button variant="ghost" size="sm" disabled>Authenticating...</Button>;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
              <AvatarFallback>
                {user.displayName?.charAt(0) ?? user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={() => handleSignOut(auth)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={async () => await handleSignIn(auth, firestore)}>
      <LogIn className="mr-2 h-4 w-4" /> Login with Google
    </Button>
  );
}
