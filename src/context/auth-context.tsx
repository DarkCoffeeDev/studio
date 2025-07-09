// src/context/auth-context.tsx (VERSIÓN DE DIAGNÓSTICO TEMPORAL)
"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { AppUser } from '@/lib/types';
// import { useRouter } from 'next/navigation'; // NO USAR TEMPORALMENTE

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  // const router = useRouter(); // NO USAR TEMPORALMENTE

  useEffect(() => {
    console.log("AuthProvider: Efecto de montaje (DIAGNÓSTICO)");
    // NO acceder a localStorage aquí
    // NO hacer llamadas a router.replace aquí
    setLoading(false); // Simplemente para que no se quede cargando infinitamente
  }, []);

  const signInWithGoogle = async () => {
    console.log("AuthProvider: Mock signInWithGoogle (DIAGNÓSTICO)");
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
        setUser({ uid: 'mock-google-user-123', email: 'test@example.com', displayName: 'Test User' });
        // localStorage.setItem('mockUser', JSON.stringify(mockUser)); // NO USAR TEMPORALMENTE
        // router.push('/dashboard'); // NO USAR TEMPORALMENTE
    } catch (error) {
      console.error("Error durante Google sign-in (DIAGNÓSTICO)", error);
    } finally {
        setLoading(false);
    }
  };

  // ... (simplifica signInWithEmail, signUpWithEmail, logout de manera similar, quitando localStorage y router.push)

  const value = { user, loading, signInWithGoogle, /* ... etc. */ };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("Error: useAuth llamado fuera de AuthProvider. Stack:", new Error().stack); // Log adicional
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};