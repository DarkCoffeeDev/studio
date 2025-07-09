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

export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  password?: string;
  photoURL?: string;
};

export type Device = {
  id: string;
  name: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};
