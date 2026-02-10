'use client';

import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <FirebaseProvider>{children}</FirebaseProvider>;
};
