// src/app/(app)/status/page.tsx
"use client"; // Asegura que la página sea un componente cliente

import dynamic from 'next/dynamic';

// Carga StatusPageContent dinámicamente y deshabilita el SSR
const DynamicStatusPageContent = dynamic(() => import('@/components/clemmont/StatusPageContent'), { ssr: false });

export default function StatusPage() {
  return (
    <DynamicStatusPageContent />
  );
}