// src/components/clemmont/AuthPageContent.tsx
"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/auth-context"; // LLAMAR DIRECTAMENTE
import { useLanguage } from "@/context/language-context"; // LLAMAR DIRECTAMENTE
import { Skeleton } from '@/components/ui/skeleton'; // Importa Skeleton si aún no lo has hecho

// Carga YetiLogin dinámicamente y deshabilita el SSR
const DynamicYetiLogin = dynamic(() => import('@/components/clemmont/YetiLogin'), { ssr: false });

interface AuthPageContentProps {
  mode: 'login' | 'signup';
}

export default function AuthPageContent({ mode }: AuthPageContentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Llama a los hooks incondicionalmente en la parte superior
  const { signInWithEmail, signInWithGoogle, signUpWithEmail, loading } = useAuth();
  const { t } = useLanguage();

  // Muestra un esqueleto o cargador si no estamos en el cliente O si Auth está cargando
  if (!isClient || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-8">
        {/* Un esqueleto simple para el formulario de login/signup */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm p-8 bg-background rounded-lg shadow-lg">
          <Skeleton className="h-40 w-40 rounded-full mb-8" /> {/* Para el Yeti */}
          <Skeleton className="h-10 w-full mb-4" /> {/* Para el campo de email */}
          <Skeleton className="h-10 w-full mb-6" /> {/* Para el campo de contraseña */}
          <Skeleton className="h-12 w-full mb-4" /> {/* Para el botón de Login */}
          <Skeleton className="h-12 w-full" /> {/* Para el botón de Google */}
        </div>
      </div>
    );
  }

  return (
    // Los estilos de fondo deberían estar en el layout padre, como en src/app/(auth)/layout.tsx
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <DynamicYetiLogin
        mode={mode}
        onLogin={(email, password) => signInWithEmail(email, password)}
        onSignup={(username, email, password) => signUpWithEmail(username, email, password)}
        onGoogleLogin={signInWithGoogle}
        loading={loading}
        error="" // El error aquí se pasaría desde el estado global si lo tuvieras
        t={t}
      />
    </div>
  );
}