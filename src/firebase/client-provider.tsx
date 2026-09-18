'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider, useAuth, useUser } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

function AnonymousSignIn() {
  const auth = useAuth();
  const { isUserLoading, user } = useUser();

  useEffect(() => {
    // When auth is initialized and we have determined there is no user
    if (auth && !isUserLoading && !user) {
      signInAnonymously(auth);
    }
  }, [isUserLoading, user, auth]);

  return null;
}


interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
      storage={firebaseServices.storage}
    >
      <AnonymousSignIn />
      {children}
    </FirebaseProvider>
  );
}
