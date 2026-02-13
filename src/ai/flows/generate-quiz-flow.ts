'use server';
/**
 * @fileOverview An AI flow for generating financial quizzes.
 *
 * - generateQuiz - A function that generates a set of quiz questions.
 * - QuizInput - The input type for the generateQuiz function.
 * - QuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnswerSchema = z.object({
  text: z.string().describe('The text of the answer option.'),
  isCorrect: z.boolean().describe('Whether this answer is the correct one.'),
});

const QuestionSchema = z.object({
  id: z.number().describe('A unique ID for the question.'),
  text: z.string().describe('The text of the question.'),
  answers: z.array(AnswerSchema).length(4).describe('An array of 4 possible answers.'),
});

const QuizInputSchema = z.object({
  count: z.number().describe('The number of questions to generate.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty of the questions.'),
  isDailyChallenge: z.boolean().optional().describe('If true, generate a short, fun daily challenge quiz with easy difficulty.'),
});
export type QuizInput = z.infer<typeof QuizInputSchema>;

const QuizOutputSchema = z.object({
  questions: z.array(QuestionSchema),
});
export type QuizOutput = z.infer<typeof QuizOutputSchema>;


export async function generateQuiz(input: QuizInput): Promise<QuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: QuizInputSchema },
  output: { schema: QuizOutputSchema },
  prompt: `You are an expert in finance and creating educational content. 
  
  {{#if isDailyChallenge}}
  Generate a short, fun quiz with {{count}} multiple-choice questions about finance, crypto, blockchain, stocks, and bonds.
  The difficulty of the questions should be easy. These are for a quick daily challenge.
  {{else}}
  Generate a quiz with {{count}} multiple-choice questions about finance, crypto, blockchain, stocks, and bonds.
  The difficulty of the questions should be {{difficulty}}.
  {{/if}}
  
  For each question, provide exactly 4 answer options, and ensure that only one of them is correct.
  
  Please provide the output in the specified JSON format. Ensure the question IDs are unique.
  `,
});


const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: QuizInputSchema,
    outputSchema: QuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate quiz questions.');
    }
    return output;
  }
);
