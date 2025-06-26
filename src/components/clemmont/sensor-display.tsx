"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Thermometer, Waves } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import type { SensorData } from '@/lib/types';

interface SensorDisplayProps {
  data: SensorData;
}

function SensorCard({
  icon,
  title,
  value,
  unit,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
}) {
  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function SensorDisplay({ data }: SensorDisplayProps) {
  const { t } = useLanguage();

  return (
    <Card className="shadow-lg bg-white/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{t.sensors}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SensorCard
          icon={<Droplets className="h-5 w-5 text-accent" />}
          title={t.humidity}
          value={data.humidity}
          unit="%"
        />
        <SensorCard
          icon={<Waves className="h-5 w-5 text-accent" />}
          title={t.waterLevel}
          value={data.waterLevel}
          unit=" L"
        />
        <SensorCard
          icon={<Thermometer className="h-5 w-5 text-accent" />}
          title={t.temperature}
          value={data.temperature}
          unit="°C"
        />
      </CardContent>
    </Card>
  );
}
