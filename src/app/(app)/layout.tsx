// src/app/layout.tsx - CORRECTED ROOT LAYOUT
"use client";

import { AuthProvider } from '@/context/auth-context';
import { LanguageProvider } from '@/context/language-context';
import { Toaster } from '@/components/ui/toaster';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}