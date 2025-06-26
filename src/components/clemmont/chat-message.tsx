"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isClemmont = message.sender === 'clemmont';
  return (
    <div
      className={cn(
        'flex items-start gap-3 my-4 animate-in fade-in slide-in-from-bottom-4 duration-500',
        isClemmont ? 'justify-start' : 'justify-end'
      )}
    >
      {isClemmont && (
        <Avatar className="h-8 w-8 border-2 border-primary">
          <AvatarFallback className="bg-primary/20 text-primary">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md',
          isClemmont
            ? 'bg-white rounded-tl-none'
            : 'bg-primary/80 text-primary-foreground rounded-tr-none'
        )}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
       {!isClemmont && (
        <Avatar className="h-8 w-8 border-2 border-muted-foreground">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
