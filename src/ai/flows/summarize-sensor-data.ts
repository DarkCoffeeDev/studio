'use server';

/**
 * @fileOverview Summarizes recent sensor data for a user.
 *
 * - summarizeSensorData - A function that summarizes recent sensor data.
 * - SummarizeSensorDataInput - The input type for the summarizeSensorData function.
 * - SummarizeSensorDataOutput - The return type for the summarizeSensorData function.
 */

import {ai} from '@/ai/genkit';
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
  return summarizeSensorDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSensorDataPrompt',
  input: {schema: SummarizeSensorDataInputSchema},
  output: {schema: SummarizeSensorDataOutputSchema},
  prompt: `You are an AI assistant that provides summaries of recent sensor data for a gardening application.

  Here's the recent sensor data:
  Timestamp: {{{timestamp}}}
  Humidity: {{{humidity}}}%
  Water Level: {{{waterLevel}}} liters
  Temperature: {{{temperature}}}°C

  Provide a concise summary (one sentence) of the sensor data, highlighting the key conditions of the plants and soil. Focus on whether conditions are optimal, too dry, or too wet.
  `,
});

const summarizeSensorDataFlow = ai.defineFlow(
  {
    name: 'summarizeSensorDataFlow',
    inputSchema: SummarizeSensorDataInputSchema,
    outputSchema: SummarizeSensorDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
