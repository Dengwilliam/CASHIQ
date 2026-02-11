'use server';
/**
 * @fileOverview An AI flow for generating explanations for quiz answers.
 *
 * - generateExplanation - A function that generates an explanation for why an answer is correct or incorrect.
 * - ExplanationInput - The input type for the generateExplanation function.
 * - ExplanationOutput - The return type for the generateExplanation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExplanationInputSchema = z.object({
  question: z.string().describe('The quiz question that was asked.'),
  userAnswer: z.string().describe('The answer the user selected.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});
export type ExplanationInput = z.infer<typeof ExplanationInputSchema>;

const ExplanationOutputSchema = z.object({
  explanation: z.string().describe('A simple explanation of the financial concept, clarifying why the correct answer is right and the user\'s answer was wrong.'),
});
export type ExplanationOutput = z.infer<typeof ExplanationOutputSchema>;

export async function generateExplanation(input: ExplanationInput): Promise<ExplanationOutput> {
  return generateExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationPrompt',
  input: { schema: ExplanationInputSchema },
  output: { schema: ExplanationOutputSchema },
  prompt: `You are an expert in finance and creating educational content. 
  A user is taking a quiz and has answered a question incorrectly. 
  Your task is to provide a simple, clear, and encouraging explanation of the underlying financial concept.

  The question was: "{{question}}"
  The user answered: "{{userAnswer}}"
  The correct answer is: "{{correctAnswer}}"

  Explain why "{{correctAnswer}}" is the right answer and gently clarify any misunderstanding the user might have based on their choice of "{{userAnswer}}".
  Keep the explanation concise and easy to understand for a beginner.
  `,
});

const generateExplanationFlow = ai.defineFlow(
  {
    name: 'generateExplanationFlow',
    inputSchema: ExplanationInputSchema,
    outputSchema: ExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate explanation.');
    }
    return output;
  }
);
