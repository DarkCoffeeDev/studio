// src/app/(app)/layout.tsx
"use client"; // Este layout debe ser un componente cliente

import dynamic from 'next/dynamic'; // Importa dynamic

// Carga AppLayoutContent dinámicamente y deshabilita el SSR
const DynamicAppLayoutContent = dynamic(() => import('@/components/clemmont/AppLayoutContent'), { ssr: false });

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Este layout ya no llama a useAuth directamente
  return (
    <DynamicAppLayoutContent>
      {children}
    </DynamicAppLayoutContent>
  );
}