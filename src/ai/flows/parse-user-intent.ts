// src/ai/flows/parse-user-intent.ts
'use server';

/**
 * @fileOverview Parses user's natural language input to extract the intent and parameters for irrigation control.
 *
 * - parseUserIntent - A function that takes user input and returns the parsed intent.
 * - ParseUserIntentInput - The input type for the parseUserIntent function.
 * - ParseUserIntentOutput - The return type for the parseUserIntent function.
 */

import {z} from 'genkit';

const ParseUserIntentInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user input string containing the command for the irrigation system.'),
});
export type ParseUserIntentInput = z.infer<typeof ParseUserIntentInputSchema>;

const ParseUserIntentOutputSchema = z.object({
  intent: z
    .string()
    .describe('The intent of the user command (e.g., water_plants, check_status).'),
  parameters: z
    .object({
      duration: z
        .number()
        .optional()
        .describe('The watering duration in minutes.'),
    })
    .describe(
      'A JSON object containing the parameters for the command (e.g., { "duration": 10 }).'
    )
    .optional(),
});
export type ParseUserIntentOutput = z.infer<typeof ParseUserIntentOutputSchema>;

export async function parseUserIntent(input: ParseUserIntentInput): Promise<ParseUserIntentOutput> {
  return {
    intent: 'check_status',
    parameters: {},
  };
}
