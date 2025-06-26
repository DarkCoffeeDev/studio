// src/ai/flows/parse-user-intent.ts
'use server';

/**
 * @fileOverview Parses user's natural language input to extract the intent and parameters for irrigation control.
 *
 * - parseUserIntent - A function that takes user input and returns the parsed intent.
 * - ParseUserIntentInput - The input type for the parseUserIntent function.
 * - ParseUserIntentOutput - The return type for the parseUserIntent function.
 */

import {ai} from '@/ai/genkit';
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
  return parseUserIntentFlow(input);
}

const parseUserIntentPrompt = ai.definePrompt({
  name: 'parseUserIntentPrompt',
  input: {schema: ParseUserIntentInputSchema},
  output: {schema: ParseUserIntentOutputSchema},
  prompt: `You are a natural language understanding agent for an irrigation system.
  Your task is to parse the user's input and extract the intent and parameters.

  The intent should be one of the following: water_plants, check_status.

  The parameters should be a JSON object containing the parameters for the command.

  For example, if the user says "water the plants for 10 minutes", the intent should be "water_plants" and the parameters should be { "duration": 10 }.
  If the user says "check the status of the system", the intent should be "check_status" and the parameters should be {}.

  User Input: {{{userInput}}}

  Intent and Parameters:`, // The prompt should guide the model to extract intent and parameters in JSON format.
});

const parseUserIntentFlow = ai.defineFlow(
  {
    name: 'parseUserIntentFlow',
    inputSchema: ParseUserIntentInputSchema,
    outputSchema: ParseUserIntentOutputSchema,
  },
  async input => {
    const {output} = await parseUserIntentPrompt(input);
    return output!;
  }
);
