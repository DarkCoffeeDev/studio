// src/app/(app)/layout.tsx
"use client";

import dynamic from 'next/dynamic';
import "@/app/globals.css"; // La importación corregida a ruta absoluta

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