// src/app/layout.tsx
"use client"; // Es crucial que el layout raíz sea un componente de cliente si provee contextos.

import { AuthProvider } from '@/context/auth-context';
import { LanguageProvider } from '@/context/language-context';
import { Toaster } from '@/components/ui/toaster'; // Para las notificaciones de tostada
import "./globals.css"; // Tu CSS global

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"> {/* Puedes cambiar 'en' por el idioma por defecto si lo deseas */}
      <body>
        <LanguageProvider>
          {/* AuthProvider envuelve a todos los children para que useAuth esté disponible */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
        {/* El Toaster se coloca aquí para que las tostadas se muestren globalmente */}
        <Toaster />
      </body>
    </html>
  );
}