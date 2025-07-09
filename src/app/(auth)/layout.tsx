// src/app/(auth)/layout.tsx
"use client"; // Mantiene el layout como componente cliente

// Ya no necesitamos useMediaQuery aquí porque el layout raíz provee los contextos
// y el diseño de la página de autenticación se maneja dentro de AuthPageContent.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-slate-900 dark:to-slate-800">
      {/* El contenido (AuthPageContent dinámico) se centrará aquí */}
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}