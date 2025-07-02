"use server";

import type { Language } from '@/lib/translations';

const getResponses = (lang: Language) => ({
  en: {
    greeting: "Hello! How can I help you today?",
    add_plant: "Sure, let's add a new plant!",
    schedule_watering: "Watering schedule set!",
    unknown: "Sorry, I can only answer basic questions like 'hello', 'add a plant', or 'schedule watering'."
  },
  es: {
    greeting: "¡Hola! ¿En qué puedo ayudarte hoy?",
    add_plant: "¡Claro, vamos a agregar una nueva planta!",
    schedule_watering: "¡Horario de riego programado!",
    unknown: "Lo siento, solo puedo responder preguntas básicas como 'hola', 'agregar una planta' o 'agendar riego'."
  }
});

export async function handleUserCommand(
  userInput: string,
  lang: Language,
): Promise<string> {
  const responses = getResponses(lang)[lang];
  const input = userInput.trim().toLowerCase();
  if (!input) return responses.unknown;
  if (input.includes('hello') || input.includes('hola')) return responses.greeting;
  if (input.includes('add') && input.includes('plant')) return responses.add_plant;
  if (input.includes('agregar') && input.includes('planta')) return responses.add_plant;
  if (input.includes('schedule') || input.includes('agendar') || input.includes('horario')) return responses.schedule_watering;
  return responses.unknown;
}
