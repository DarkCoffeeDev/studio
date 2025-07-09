// src/components/clemmont/AuthPageContent.tsx
"use client"; // Este componente DEBE ser un componente cliente

import dynamic from 'next/dynamic';
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

// Carga YetiLogin dinámicamente y deshabilita el SSR
const DynamicYetiLogin = dynamic(() => import('@/components/clemmont/YetiLogin'), { ssr: false });

interface AuthPageContentProps {
  mode: 'login' | 'signup';
}

export default function AuthPageContent({ mode }: AuthPageContentProps) {
  // useAuth y useLanguage se llaman AHORA aquí, dentro de un componente cliente puro
  const { signInWithEmail, signInWithGoogle, signUpWithEmail, loading } = useAuth();
  const { t } = useLanguage();

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