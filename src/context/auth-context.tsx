// src/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define el tipo para el objeto de usuario (simplificado para el mock)
interface User {
  id: string;
  email: string;
  username?: string;
}

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  signUpWithEmail: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente proveedor de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Inicia en true para indicar que estamos cargando el estado de autenticación

  useEffect(() => {
    // Esto se ejecuta solo en el cliente
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('mockUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user:", e);
          sessionStorage.removeItem('mockUser'); // Limpiar si hay un error de parseo
        }
      }
      setLoading(false); // Una vez que se intenta cargar desde sessionStorage, el loading termina
    }
  }, []);

  // Funciones mock de autenticación
  const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    // Simula una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email === "test@example.com" && password === "password123") {
      const mockUser: User = { id: "1", email: "test@example.com", username: "TestUser" };
      setUser(mockUser);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mockUser', JSON.stringify(mockUser)); // Guarda en sessionStorage
      }
      setLoading(false);
      return mockUser;
    } else {
      setLoading(false);
      alert("Credenciales incorrectas (mock)");
      return null;
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: "2", email: "google@example.com", username: "GoogleUser" };
    setUser(mockUser);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mockUser', JSON.stringify(mockUser)); // Guarda en sessionStorage
    }
    setLoading(false);
    return mockUser;
  };

  const signUpWithEmail = async (username: string, email: string, password: string): Promise<User | null> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: "3", email: email, username: username };
    setUser(mockUser);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mockUser', JSON.stringify(mockUser)); // Guarda en sessionStorage
    }
    setLoading(false);
    return mockUser;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mockUser'); // Elimina de sessionStorage
    }
    setLoading(false);
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

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}