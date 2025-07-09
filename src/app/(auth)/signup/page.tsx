// src/app/(auth)/signup/page.tsx
"use client";

import dynamic from 'next/dynamic'; // Importa dynamic de next/dynamic
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

// Carga YetiLogin dinámicamente y deshabilita el SSR
const DynamicYetiLogin = dynamic(() => import('@/components/clemmont/YetiLogin'), { ssr: false });

export default function SignupPage() {
  const { signUpWithEmail, signInWithGoogle, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-slate-900 dark:to-slate-800">
      <DynamicYetiLogin
        mode="signup"
        onSignup={(username, email, password) => signUpWithEmail(username, email, password)}
        onGoogleLogin={signInWithGoogle}
        loading={loading}
        t={t}
      />
    </div>
  );
}