"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

import { Button } from "@/components/ui/button";
import YetiLogin from "@/components/clemmont/YetiLogin";

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-slate-900 dark:to-slate-800">
      <YetiLogin
        onLogin={(email, password) => signInWithEmail(email, password)}
        onGoogleLogin={signInWithGoogle}
      />
      <div className="mt-4 text-center">
        <p className="text-sm">
          {t.dontHaveAccount}{" "}
          <Link href="/signup" className="font-semibold underline">
            {t.signup}
          </Link>
        </p>
      </div>
    </div>
  );
}
