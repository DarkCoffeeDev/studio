"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false); // No async Firebase call
  const router = useRouter();

  // Mock user data storage (for demonstration purposes only)
  const [mockUsers, setMockUsers] = useState<any[]>([]);

  useEffect(() => {
    // Simulate checking local storage for a logged-in user
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
        const mockUser = {
            uid: 'mock-google-user-123',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://placehold.co/40x40/png',
        };
        setUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        router.push('/dashboard');
    } catch (error) {
      console.error("Error during Google sign-in", error);
    } finally {
        setLoading(false);
    }
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
        if (mockUsers.some(u => u.email === email)) {
            throw { code: 'auth/email-already-in-use' };
        }
        const newUser = {
            uid: `mock-email-user-${Date.now()}`,
            email,
            displayName: name,
            password: pass, // In a real app, never store plain passwords
            photoURL: '',
        };
        setMockUsers(prev => [...prev, newUser]);
        setUser(newUser);
        localStorage.setItem('mockUser', JSON.stringify(newUser));
        router.push('/dashboard');
        return Promise.resolve(null); // Simulate successful signup
    } catch (error) {
        console.error("Error during email sign-up", error);
        return Promise.reject(error); // Simulate error during signup
    } finally {
        setLoading(false);
    }
  }

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
        const foundUser = mockUsers.find(u => u.email === email && u.password === pass);
        if (!foundUser) {
            throw { code: 'auth/invalid-credential' };
        }
        setUser(foundUser);
        localStorage.setItem('mockUser', JSON.stringify(foundUser));
        router.push('/dashboard');
        return Promise.resolve(null); // Simulate successful sign-in
    } catch (error) {
        console.error("Error during email sign-in", error);
        return Promise.reject(error); // Simulate error during sign-in
    } finally {
        setLoading(false);
    }
  }

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      setUser(null);
      localStorage.removeItem('mockUser');
      router.push('/login');
    } catch (error) {
      console.error("Error signing out", error);
    } finally {
        setLoading(false);
    }
  };

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
