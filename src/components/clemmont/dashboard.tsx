"use client";

import { useEffect, useState } from 'react';
import type { Message, SensorData } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { SensorDisplay } from './sensor-display';
import { QuickActions } from './quick-actions';
import { ChatInterface } from './chat-interface';
import { handleUserCommand } from '@/app/actions';
import { useAuth } from '@/context/auth-context';

const initialSensorData: SensorData = {
  humidity: 62,
  waterLevel: 75,
  temperature: 24,
};

export default function ClemmontDashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        id: 'init',
        text: t.initialMessage,
        sender: 'clemmont',
        timestamp: new Date(),
      },
    ]);
  }, [t, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData({
        humidity: Math.round(55 + Math.random() * 10),
        waterLevel: Math.round(80 - Math.random() * 20),
        temperature: Math.round(22 + Math.random() * 5),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const clemmontResponseText = await handleUserCommand(text, language);
      const clemmontMessage: Message = {
        id: `clemmont-${Date.now()}`,
        text: clemmontResponseText,
        sender: 'clemmont',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, clemmontMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Sorry, something went wrong.",
        sender: 'clemmont',
        timestamp: new Date(),
      };
       setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <main className="flex-grow p-4 md:p-8 overflow-hidden h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          <div className="lg:col-span-1 space-y-8 flex flex-col">
            <QuickActions onAction={sendMessage} />
            <SensorDisplay data={sensorData} />
          </div>
          <div className="lg:col-span-2 h-full min-h-[500px] lg:min-h-0">
            <ChatInterface messages={messages} onSendMessage={sendMessage} isLoading={isLoading}/>
          </div>
        </div>
      </main>
    </div>
  );
}
