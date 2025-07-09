// src/app/(auth)/login/page.tsx
"use client"; // <--- ¡Añade esta línea al principio!

import dynamic from 'next/dynamic';

// Carga AuthPageContent dinámicamente y deshabilita el SSR
const DynamicAuthPageContent = dynamic(() => import('@/components/clemmont/AuthPageContent'), { ssr: false });

export default function LoginPage() {
  return (
    <DynamicAuthPageContent mode="login" />
  );
}