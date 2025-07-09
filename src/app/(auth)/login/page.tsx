// src/app/(auth)/login/page.tsx
"use client"; // Asegura que la página sea un componente cliente

import dynamic from 'next/dynamic';

// Carga AuthPageContent dinámicamente y deshabilita el SSR
const DynamicAuthPageContent = dynamic(() => import('@/components/clemmont/AuthPageContent'), { ssr: false });

export default function LoginPage() {
  // useAuth y useLanguage YA NO se llaman directamente aquí
  return (
    <DynamicAuthPageContent mode="login" />
  );
}