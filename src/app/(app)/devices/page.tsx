"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
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


export default function DevicesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof addDeviceSchema>>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: { id: '', name: '' },
  });

  useEffect(() => {
    if (!user) return;

    // In a real app, you'd fetch from Firestore.
    // This is a mock implementation.
    const devicesCollection = collection(db, `users/${user.uid}/devices`);
    const q = query(devicesCollection);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userDevices: Device[] = [];
        querySnapshot.forEach((doc) => {
            userDevices.push({ ...doc.data(), id: doc.id } as Device);
        });
        setDevices(userDevices);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching devices: ", error);
        // Fallback to mock data on error for demonstration
        setDevices([
          {id: 'esp32-mock-1', name: 'Front Yard', createdAt: {seconds: Date.now()/1000, nanoseconds: 0}},
          {id: 'esp32-mock-2', name: 'Vegetable Patch', createdAt: {seconds: Date.now()/1000, nanoseconds: 0}},
        ]);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof addDeviceSchema>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/devices`), {
        ...values,
        createdAt: serverTimestamp(),
      });
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
            {loading ? (
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
