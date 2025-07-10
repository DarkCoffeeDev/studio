// src/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id?: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  signUpWithEmail: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user:", e);
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', { // Llama a tu API Route real
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        setLoading(false);
        router.push('/dashboard');
        return data.user;
      } else {
        alert(data.message || "Login failed");
        setLoading(false);
        return null;
      }
    } catch (error: any) {
      console.error("Login request failed:", error);
      alert("An error occurred during login: " + error.message);
      setLoading(false);
      return null;
    }
  };

  const signUpWithEmail = async (username: string, email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Usa el usuario retornado por la API (incluye _id)
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        setLoading(false);
        router.push('/dashboard');
        return data.user;
      } else {
        alert(data.message || "Signup failed");
        setLoading(false);
        return null;
      }
    } catch (error: any) {
      console.error("Signup request failed:", error);
      alert("An error occurred during signup: " + error.message);
      setLoading(false);
      return null;
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { _id: "google-mock-id", email: "google@example.com", username: "GoogleUser" };
    setUser(mockUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      window.location.href = '/dashboard'; // Forzar redirección
    }
    setLoading(false);
    return mockUser;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}