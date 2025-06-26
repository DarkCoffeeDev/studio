"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider, firebaseConfigured } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FirebaseNotConfigured = () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
        <div className="w-full max-w-lg rounded-lg border bg-card p-8 text-center shadow-lg">
            <h1 className="text-2xl font-bold text-destructive">Firebase Not Configured</h1>
            <p className="mt-4 text-muted-foreground">
                Your Firebase configuration is missing or incomplete. Please add your Firebase project's configuration keys to the <strong>.env</strong> file at the root of this project.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
                You can find these values in your Firebase project's settings under "Web apps". After updating the file, you may need to restart the development server.
            </p>
        </div>
    </div>
);


const createUserDocument = async (user: User, additionalData?: { displayName: string }) => {
  if (!user || !db) return;
  const userRef = doc(db, `users/${user.uid}`);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, photoURL } = user;
    const displayName = additionalData?.displayName || user.displayName;
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createUserDocument(user);
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) return;
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error during Google sign-in", error);
    } finally {
        setLoading(false);
    }
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    if (!auth) return;
    setLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await createUserDocument(user, { displayName: name });
        router.push('/dashboard');
    } finally {
        setLoading(false);
    }
  }

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) return;
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        router.push('/dashboard');
    } finally {
        setLoading(false);
    }
  }

  const logout = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (!firebaseConfigured) {
      return <FirebaseNotConfigured />;
  }

  const value = { user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
