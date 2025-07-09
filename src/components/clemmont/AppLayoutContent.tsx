// src/components/clemmont/AppLayoutContent.tsx
"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/clemmont/header';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';


function AppSkeleton() {
  return (
    <div className="flex h-screen w-full">
      {/* Esqueleto para la barra lateral */}
      <div className="hidden md:block md:w-64 bg-gray-100 p-4">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      {/* Esqueleto para el contenido principal */}
      <div className="flex-1 p-8 flex flex-col gap-4">
        <Skeleton className="h-12 w-full" /> {/* Para el Header */}
        <Skeleton className="h-full w-full" /> {/* Para el main content */}
      </div>
    </div>
  )
}

export default function AppLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { user, loading } = useAuth(); // Siempre llamar useAuth, pero manejar el estado de carga/no-cliente

  const { t } = useLanguage();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Solo redirigir si estamos en el cliente, si ya no está cargando el auth, y si no hay usuario.
    if (isClient && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router, isClient]);

  // Mostrar el skeleton si no estamos en el cliente O si el estado de autenticación está cargando
  if (!isClient || loading) { // <--- CAMBIO CLAVE AQUÍ
    return <AppSkeleton />;
  }

  // Si no hay usuario y no estamos cargando, significa que la redirección a /login debe ocurrir
  // y no debemos renderizar el contenido de la aplicación.
  // Esta condición ya está cubierta por el useEffect que redirige.
  // Sin embargo, para evitar un render momentáneo de UI sin usuario,
  // podemos añadir una comprobación aquí también, aunque el useEffect debería ser rápido.
  if (!user) {
      return null; // O un esqueleto si la redirección es muy rápida y causa un flicker
  }

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: t.dashboard },
    { href: "/devices", icon: <SlidersHorizontal />, label: t.devices },
    { href: "/status", icon: <BarChart2 />, label: t.status },
  ];

  return (
      <div className="flex h-screen w-full overflow-hidden">
        <SidebarProvider>
          <Sidebar collapsible="icon" className="border-r">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </Sidebar>
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
  );
}