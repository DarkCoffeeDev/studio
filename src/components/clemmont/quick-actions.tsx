"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { CloudDrizzle, Info } from 'lucide-react';

interface QuickActionsProps {
  onAction: (actionText: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const { t } = useLanguage();

  return (
    <Card className="shadow-lg bg-white/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{t.quickActions}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button onClick={() => onAction(t.quickActionWater)} size="lg">
          <CloudDrizzle className="mr-2 h-5 w-5" />
          {t.waterNow}
        </Button>
        <Button onClick={() => onAction(t.quickActionStatus)} size="lg" variant="secondary">
          <Info className="mr-2 h-5 w-5" />
          {t.checkStatus}
        </Button>
      </CardContent>
    </Card>
  );
}
