// src/app/(app)/dashboard/page.tsx
"use client"; // Asegura que la página sea un componente cliente

import dynamic from 'next/dynamic';

// Carga ClemmontDashboard dinámicamente y deshabilita el SSR
const DynamicClemmontDashboard = dynamic(() => import('@/components/clemmont/dashboard'), { ssr: false });

export default function DashboardPage() {
  return (
    <DynamicClemmontDashboard />
  );
}