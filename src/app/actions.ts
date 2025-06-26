"use server";

import { parseUserIntent } from '@/ai/flows/parse-user-intent';
import { summarizeSensorData } from '@/ai/flows/summarize-sensor-data';
import type { Language } from '@/lib/translations';

// In a real app, this would come from a database or live sensors
const getSensorData = () => ({
  humidity: Math.round(55 + Math.random() * 10),
  waterLevel: Math.round(80 - Math.random() * 20),
  temperature: Math.round(22 + Math.random() * 5),
  timestamp: new Date().toISOString(),
});

const getResponses = (lang: Language) => ({
  en: {
    watering: (duration: number) => `Okay, watering the plants for ${duration} minutes.`,
    watering_default: "Okay, starting to water the plants.",
    status_prefix: "Here's the current status: ",
    unknown: "Sorry, I didn't understand that. You can ask me to 'water the plants' or 'check status'.",
    error: "An error occurred while processing your request. Please try again later."
  },
  es: {
    watering: (duration: number) => `Claro, regando las plantas por ${duration} minutos.`,
    watering_default: "Claro, comenzando a regar las plantas.",
    status_prefix: "Aquí está el estado actual: ",
    unknown: "Lo siento, no entendí eso. Puedes pedirme 'regar las plantas' o 'verificar estado'.",
    error: "Ocurrió un error al procesar tu solicitud. Por favor, inténtalo más tarde."
  }
});


export async function handleUserCommand(
  userInput: string,
  lang: Language,
): Promise<string> {
  const responses = getResponses(lang)[lang];
  try {
    if (!userInput.trim()) {
        return responses.unknown;
    }
    const { intent, parameters } = await parseUserIntent({ userInput });
    
    switch (intent) {
      case 'water_plants':
        const duration = parameters?.duration;
        if (typeof duration === 'number' && duration > 0) {
          return responses.watering(duration);
        }
        return responses.watering_default;
      
      case 'check_status':
        const sensorData = getSensorData();
        const { summary } = await summarizeSensorData(sensorData);
        return `${responses.status_prefix}${summary}`;

      default:
        return responses.unknown;
    }

  } catch (e) {
    console.error("Error handling user command:", e);
    return responses.error;
  }
}
