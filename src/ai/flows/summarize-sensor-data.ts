'use server';

/**
 * @fileOverview Summarizes recent sensor data for a user.
 *
 * - summarizeSensorData - A function that summarizes recent sensor data.
 * - SummarizeSensorDataInput - The input type for the summarizeSensorData function.
 * - SummarizeSensorDataOutput - The return type for the summarizeSensorData function.
 */

import {z} from 'genkit';

const SummarizeSensorDataInputSchema = z.object({
  humidity: z.number().describe('The current soil humidity level (percentage).'),
  waterLevel: z.number().describe('The current water level in the tank (liters).'),
  temperature: z.number().describe('The current ambient temperature (Celsius).'),
  timestamp: z.string().describe('The timestamp of the sensor data.'),
});
export type SummarizeSensorDataInput = z.infer<typeof SummarizeSensorDataInputSchema>;

const SummarizeSensorDataOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the recent sensor data.'),
});
export type SummarizeSensorDataOutput = z.infer<typeof SummarizeSensorDataOutputSchema>;

export async function summarizeSensorData(input: SummarizeSensorDataInput): Promise<SummarizeSensorDataOutput> {
  return {summary: 'No summary available in mock mode.'};
}
