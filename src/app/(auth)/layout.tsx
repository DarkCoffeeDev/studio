// src/app/layout.tsx
"use client"; // Muy importante que sea un cliente aquí

import { AuthProvider } from '@/context/auth-context';
import { LanguageProvider } from '@/context/language-context';
import { Toaster } from '@/components/ui/toaster';
import "./globals.css"; // Asegúrate de que esta línea esté, es tu CSS principal.

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