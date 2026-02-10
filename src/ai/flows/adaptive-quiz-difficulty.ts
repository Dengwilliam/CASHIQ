'use server';

/**
 * @fileOverview This file defines a Genkit flow for adaptive quiz difficulty adjustment.
 *
 * The flow evaluates the user's recent performance and suggests whether to increase or decrease the difficulty level.
 * It exports:
 *   - `adjustQuizDifficulty`: The main function to call for difficulty adjustment.
 *   - `AdjustQuizDifficultyInput`: The input type for the adjustQuizDifficulty function.
 *   - `AdjustQuizDifficultyOutput`: The output type for the adjustQuizDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustQuizDifficultyInputSchema = z.object({
  recentPerformance: z
    .array(z.boolean())
    .describe("An array of booleans representing the user's recent performance (true = correct, false = incorrect)."),
});
export type AdjustQuizDifficultyInput = z.infer<typeof AdjustQuizDifficultyInputSchema>;

const AdjustQuizDifficultyOutputSchema = z.object({
  difficultyAdjustment: z
    .enum(['increase', 'decrease', 'maintain'])
    .describe('A suggestion to increase, decrease, or maintain the quiz difficulty.'),
});
export type AdjustQuizDifficultyOutput = z.infer<typeof AdjustQuizDifficultyOutputSchema>;

export async function adjustQuizDifficulty(input: AdjustQuizDifficultyInput): Promise<AdjustQuizDifficultyOutput> {
  return adjustQuizDifficultyFlow(input);
}

const adjustQuizDifficultyPrompt = ai.definePrompt({
  name: 'adjustQuizDifficultyPrompt',
  input: {schema: AdjustQuizDifficultyInputSchema},
  output: {schema: AdjustQuizDifficultyOutputSchema},
  prompt: `You are an AI quiz master. You will analyze a player's recent performance on a quiz and
  determine whether the difficulty should be increased, decreased, or maintained.

  Here's the player's recent performance (true = correct, false = incorrect):
  {{#each recentPerformance}}
  - {{this}}
  {{/each}}

  Based on this performance, should the quiz difficulty be increased, decreased, or maintained?
  Respond with ONLY one of the following values:
  - increase
  - decrease
  - maintain`,
});

const adjustQuizDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustQuizDifficultyFlow',
    inputSchema: AdjustQuizDifficultyInputSchema,
    outputSchema: AdjustQuizDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustQuizDifficultyPrompt(input);
    return output!;
  }
);
