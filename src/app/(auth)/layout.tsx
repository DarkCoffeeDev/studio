// src/app/(auth)/layout.tsx
"use client"; // Mantiene el layout como componente cliente

import "@/app/globals.css"; // ¡IMPORTACIÓN CORREGIDA!

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}