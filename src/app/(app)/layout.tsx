// src/app/(app)/layout.tsx (Ya debería ser como esto, o similar)
"use client";

import dynamic from 'next/dynamic';
import "@/app/globals.css"; // Esta importación es correcta

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