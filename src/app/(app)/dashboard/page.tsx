// src/app/(app)/dashboard/page.tsx
"use client"; // <--- ¡Añade esta línea al principio!

import dynamic from 'next/dynamic';

// Carga ClemmontDashboard dinámicamente y deshabilita el SSR
const DynamicClemmontDashboard = dynamic(() => import('@/components/clemmont/dashboard'), { ssr: false });

export default function DashboardPage() {
  return (
    <DynamicClemmontDashboard />
  );
}