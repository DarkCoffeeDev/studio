import type { User } from 'firebase/auth';

export type SensorData = {
  humidity: number;
  waterLevel: number;
  temperature: number;
  timestamp?: number;
};

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'clemmont';
  timestamp: Date;
};

export type AppUser = User;

export type Device = {
  id: string;
  name: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};
