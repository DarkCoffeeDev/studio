"use client";

import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import type { Language } from '@/lib/translations';

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-headline text-primary">{t.title}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Languages className="mr-2 h-4 w-4" />
            {t.language}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
          >
            <DropdownMenuRadioItem value="en">{t.english}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="es">{t.spanish}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
