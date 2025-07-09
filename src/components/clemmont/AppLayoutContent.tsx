// src/components/clemmont/AppLayoutContent.tsx
"use client"; // Este componente DEBE ser un componente cliente

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react'; // Importa useState
import { Header } from '@/components/clemmont/header';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';


function AppSkeleton() {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:block md:w-64 bg-gray-100 p-4">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="flex-1 p-8">
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

export default function AppLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false); // Estado para asegurar la ejecución en cliente

  useEffect(() => {
    setIsClient(true);
  }, []);

  // useAuth y useLanguage SOLO se llamarán si isClient es true
  const { user, loading } = isClient ? useAuth() : { user: null, loading: true, signInWithEmail: () => Promise.resolve(null), signInWithGoogle: () => Promise.resolve(), signUpWithEmail: () => Promise.resolve(null), logout: () => Promise.resolve() };
  const { t } = isClient ? useLanguage() : { t: {} as any };

  const router = useRouter();
  const pathname = usePathname();
  

  useEffect(() => {
    if (isClient && !loading && !user) { // Asegura que se ejecuta en cliente y después de cargar
      router.replace('/login');
    }
  }, [user, loading, router, isClient]);

  if (!isClient || loading || !user) {
    return <AppSkeleton />;
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