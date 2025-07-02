"use client";
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import type { Device, SensorData } from '@/lib/types';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

function generateMockSensorData() {
  const data: SensorData[] = [];
  const now = Date.now();
  for (let i = 23; i >= 0; i--) {
    const timestamp = now - i * 60 * 60 * 1000;
    data.push({
      timestamp,
      temperature: Math.floor(Math.random() * 10) + 20, // 20-30 C
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      waterLevel: Math.floor(Math.random() * 50) + 50, // 50-100%
    });
  }
  return data;
}

// Mock function to generate device data (copied from devices page for consistency)
function generateMockDevicesForStatus(): Device[] {
  return [
    {id: 'mock-device-1', name: 'Front Yard', createdAt: {seconds: Date.now()/1000 - 3600, nanoseconds: 0}},
    {id: 'mock-device-2', name: 'Backyard Garden', createdAt: {seconds: Date.now()/1000 - 7200, nanoseconds: 0}},
    {id: 'mock-device-3', name: 'Flower Beds', createdAt: {seconds: Date.now()/1000 - 10800, nanoseconds: 0}},
  ];
}

const ChartCard = ({ title, data, dataKey, color, unit }: { title: string, data: any[], dataKey: string, color: string, unit: string }) => {
    const formattedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    }, [data]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis unit={unit} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                        <Legend />
                        <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};


export default function StatusPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from Firestore. Using mock data for now.
    const mockDevices = generateMockDevicesForStatus();
    setDevices(mockDevices);
    if (mockDevices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(mockDevices[0].id);
    }
    setLoading(false);
    
  }, [user, selectedDeviceId]);

  useEffect(() => {
    if (!user || !selectedDeviceId) {
        setSensorData([]);
        return;
    }
    setLoading(true);
    // In a real app, this would fetch from Firestore. Using mock data for now.
    const mockData = generateMockSensorData();
    setSensorData(mockData);
    setLoading(false);
    
  }, [user, selectedDeviceId]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">{t.sensorStatus}</h1>
        {loading && !selectedDeviceId ? <Skeleton className="h-10 w-64"/> : (
          <Select onValueChange={setSelectedDeviceId} value={selectedDeviceId || undefined}>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder={t.selectDevice} />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-96 w-full"/>
            <Skeleton className="h-96 w-full"/>
            <Skeleton className="h-96 w-full"/>
        </div>
      ) : selectedDeviceId && sensorData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
            <ChartCard title={t.temperature} data={sensorData} dataKey="temperature" color="#f97316" unit="°C" />
            <ChartCard title={t.humidity} data={sensorData} dataKey="humidity" color="#3b82f6" unit="%" />
            <ChartCard title={t.waterLevel} data={sensorData} dataKey="waterLevel" color="#14b8a6" unit="%" />
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">{t.noDeviceSelected}</p>
        </div>
      )}
    </div>
  );
}
