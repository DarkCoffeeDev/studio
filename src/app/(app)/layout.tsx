// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';
import React, { useState, useEffect } from 'react'; // Importa useState y useEffect

export const metadata: Metadata = {
  title: 'Clemmont Irrigation Agent',
  description: 'An AI-powered irrigation assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false); // Nuevo estado para controlar la hidratación

  useEffect(() => {
    // Este efecto se ejecuta SOLO en el cliente, después del primer render.
    setIsClient(true);
  }, []);

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Asegúrate de que Belleza, Alegreya y Source Sans Pro estén aquí si las usas */}
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,700;1,400&family=Belleza&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased h-full">
        {/* Solo renderiza los proveedores de contexto y el contenido si estamos en el cliente */}
        {isClient ? (
          <LanguageProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        ) : (
          // Opcional: un esqueleto o loader muy simple mientras se hidrata la app
          <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
            Cargando aplicación...
          </div>
        )}
      </body>
    </html>
  );
}