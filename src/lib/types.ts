export type SensorData = {
  humidity: number;
  waterLevel: number;
  temperature: number;
};

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'clemmont';
  timestamp: Date;
};
