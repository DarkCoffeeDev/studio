// src/app/(app)/dashboard/page.tsx

import dynamic from 'next/dynamic';

// Carga ClemmontDashboard dinámicamente y deshabilita el SSR
const DynamicClemmontDashboard = dynamic(() => import('@/components/clemmont/dashboard'), { ssr: false });

export default function DashboardPage() {
  // useLanguage YA NO se llama directamente dentro de este archivo
  return (
    <DynamicClemmontDashboard />
  );
}