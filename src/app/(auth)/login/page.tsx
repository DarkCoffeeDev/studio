"use client";

import YetiLogin from "@/components/clemmont/YetiLogin";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-slate-900 dark:to-slate-800">
      <YetiLogin
        mode="login"
        onLogin={(email, password) => signInWithEmail(email, password)}
        onGoogleLogin={signInWithGoogle}
        loading={loading}
        t={t}
      />
    </div>
  );
}
