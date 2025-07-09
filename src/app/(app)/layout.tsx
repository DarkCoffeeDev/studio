// src/app/(app)/layout.tsx
"use client"; // <--- ¡Esta línea DEBE ser la primera!

import dynamic from 'next/dynamic';
import "@/app/globals.css"; // Se corrigió la ruta de importación a una ruta absoluta

// Carga AppLayoutContent dinámicamente y deshabilita el SSR
const DynamicAppLayoutContent = dynamic(() => import('@/components/clemmont/AppLayoutContent'), { ssr: false });

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DynamicAppLayoutContent>
      {children}
    </DynamicAppLayoutContent>
  );
}