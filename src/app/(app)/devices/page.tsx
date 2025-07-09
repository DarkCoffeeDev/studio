// src/app/(app)/devices/page.tsx

import dynamic from 'next/dynamic';

// Carga DevicesPageContent dinámicamente y deshabilita el SSR
const DynamicDevicesPageContent = dynamic(() => import('@/components/clemmont/DevicesPageContent'), { ssr: false });

export default function DevicesPage() {
  // useAuth y useLanguage YA NO se llaman directamente dentro de este archivo
  return (
    <DynamicDevicesPageContent />
  );
}