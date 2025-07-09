// src/app/(auth)/signup/page.tsx
"use client"; // <--- ¡Añade esta línea al principio!

import dynamic from 'next/dynamic';

// Carga AuthPageContent dinámicamente y deshabilita el SSR
const DynamicAuthPageContent = dynamic(() => import('@/components/clemmont/AuthPageContent'), { ssr: false });

export default function SignupPage() {
  return (
    <DynamicAuthPageContent mode="signup" />
  );
}