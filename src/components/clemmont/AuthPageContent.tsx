// src/components/clemmont/AuthPageContent.tsx
"use client"; // Este componente DEBE ser un componente cliente

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react'; // Importa useState y useEffect
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

// Carga YetiLogin dinámicamente y deshabilita el SSR
const DynamicYetiLogin = dynamic(() => import('@/components/clemmont/YetiLogin'), { ssr: false });

interface AuthPageContentProps {
  mode: 'login' | 'signup';
}

export default function AuthPageContent({ mode }: AuthPageContentProps) {
  const [isClient, setIsClient] = useState(false); // Nuevo estado para indicar si ya estamos en el cliente

  useEffect(() => {
    // Cuando el componente se monta en el cliente, actualiza el estado
    setIsClient(true);
  }, []);

  // useAuth y useLanguage SOLO se llamarán si isClient es true
  // Esto asegura que se ejecuten después de la hidratación y que el AuthProvider esté disponible
  const { signInWithEmail, signInWithGoogle, signUpWithEmail, loading } = isClient ? useAuth() : {
    signInWithEmail: () => Promise.resolve(null),
    signInWithGoogle: () => Promise.resolve(),
    signUpWithEmail: () => Promise.resolve(null),
    loading: true
  };
  const { t } = isClient ? useLanguage() : { t: {} as any }; // Retorna un objeto vacío o default si no está listo

  if (!isClient) {
    // Puedes retornar un loader o null mientras el componente se hidrata en el cliente
    // Para evitar errores visuales, puedes mostrar un esqueleto o el formulario básico sin funcionalidad
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-slate-900 dark:to-slate-800">
        {/* Opcional: un esqueleto simple o un mensaje de carga */}
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-slate-900 dark:to-slate-800">
      <DynamicYetiLogin
        mode={mode}
        onLogin={(email, password) => signInWithEmail(email, password)}
        onSignup={(username, email, password) => signUpWithEmail(username, email, password)}
        onGoogleLogin={signInWithGoogle}
        loading={loading}
        t={t}
      />
    </div>
  );
}