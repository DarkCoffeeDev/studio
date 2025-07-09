// src/components/clemmont/DevicesPageContent.tsx
"use client"; // Este componente DEBE ser un componente cliente

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context'; // useAuth ahora se llama aquí
import { useLanguage } from '@/context/language-context'; // useLanguage ahora se llama aquí
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Device } from '@/lib/types';
import { Laptop, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const addDeviceSchema = z.object({
  id: z.string().min(1, 'Device ID is required.'),
  name: z.string().min(1, 'Device name is required.'),
});

// Mock function to generate device data
function generateMockDevices(): Device[] {
  return [
    {id: 'mock-device-1', name: 'Front Yard', createdAt: {seconds: Date.now()/1000 - 3600, nanoseconds: 0}},
    {id: 'mock-device-2', name: 'Backyard Garden', createdAt: {seconds: Date.now()/1000 - 7200, nanoseconds: 0}},
    {id: 'mock-device-3', name: 'Flower Beds', createdAt: {seconds: Date.now()/1000 - 10800, nanoseconds: 0}},
  ];
}

function DeviceCard({ device }: { device: Device }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Laptop className="w-6 h-6 text-primary" />
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" disabled>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">ID: {device.id}</p>
                 <p className="text-xs text-muted-foreground mt-1">
                    Added on: {new Date(device.createdAt.seconds * 1000).toLocaleDateString()}
                </p>
            </CardContent>
        </Card>
    );
}

export default function DevicesPageContent() {
  const [isClient, setIsClient] = useState(false); // Nuevo estado para indicar si ya estamos en el cliente

  useEffect(() => {
    // Cuando el componente se monta en el cliente, actualiza el estado
    setIsClient(true);
  }, []);

  // useAuth y useLanguage SOLO se llamarán si isClient es true
  const { user } = isClient ? useAuth() : { user: null, loading: true, signInWithEmail: () => Promise.resolve(null), signInWithGoogle: () => Promise.resolve(), signUpWithEmail: () => Promise.resolve(null), logout: () => Promise.resolve() };
  const { t } = isClient ? useLanguage() : { t: {} as any };
  const { toast } = isClient ? useToast() : { toast: () => {} }; // toast puede no estar disponible en SSR

  const [devices, setDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true); // Renombrado para no confundir con useAuth().loading

  const form = useForm<z.infer<typeof addDeviceSchema>>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: { id: '', name: '' },
  });

  useEffect(() => {
    if (!isClient) return; // Asegúrate de que solo se ejecute en el cliente
    
    // Si Firebase estuviera activo, esto obtendría datos de Firestore.
    // Por ahora, usamos datos simulados.
    setLoadingDevices(true);
    setTimeout(() => { // Simular obtención asíncrona de datos
      setDevices(generateMockDevices());
      setLoadingDevices(false);
    }, 1000);
  }, [user, isClient]); // Depende de isClient y user

  const onSubmit = async (values: z.infer<typeof addDeviceSchema>) => {
    if (!user) {
        toast({
            title: t.deviceLinkedError,
            description: "You must be logged in to link a device.",
            variant: 'destructive',
        });
        return;
    };
    try {
      // Simular la adición de un dispositivo a una base de datos
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular llamada API
      const newDevice: Device = {
        id: values.id,
        name: values.name,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      };
      setDevices((prev) => [...prev, newDevice]); // Añadir al estado simulado
      toast({ title: t.deviceLinkedSuccess });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: t.deviceLinkedError,
        variant: 'destructive',
      });
    }
  };

  if (!isClient) {
    // Retorna un esqueleto mientras el componente se hidrata en el cliente
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t.addDevice}</CardTitle>
              <CardDescription>{t.addDeviceDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.deviceId}</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., clemmont-xyz-123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.deviceName}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.deviceName} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? '...' : t.linkDevice}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">{t.myDevices}</h2>
            {loadingDevices ? (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            ) : devices.length > 0 ? (
                <div className="space-y-4">
                    {devices.map((device) => (
                        <DeviceCard key={device.id} device={device} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">{t.noDevices}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}