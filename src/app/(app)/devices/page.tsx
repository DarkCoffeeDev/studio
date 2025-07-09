// src/app/(app)/devices/page.tsx
"use client"; // Asegura que la página sea un componente cliente

import dynamic from 'next/dynamic';

// Carga DevicesPageContent dinámicamente y deshabilita el SSR
const DynamicDevicesPageContent = dynamic(() => import('@/components/clemmont/DevicesPageContent'), { ssr: false });

export default function DevicesPage() {
  return (
    <DynamicDevicesPageContent />
  );
}