'use server';
/**
 * @fileOverview An AI flow for generating daily quizzes.
 *
 * - generateDailyQuiz - A function that generates a set of quiz questions for the daily challenge.
 * - DailyQuizInput - The input type for the generateDailyQuiz function.
 * - DailyQuizOutput - The return type for the generateDailyQuiz function.
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

const DailyQuizInputSchema = z.object({
  count: z.number().min(3).max(5).describe('The number of questions to generate.'),
});
export type DailyQuizInput = z.infer<typeof DailyQuizInputSchema>;

const DailyQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema),
});
export type DailyQuizOutput = z.infer<typeof DailyQuizOutputSchema>;


export async function generateDailyQuiz(input: DailyQuizInput): Promise<DailyQuizOutput> {
  return generateDailyQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyQuizPrompt',
  input: { schema: DailyQuizInputSchema },
  output: { schema: DailyQuizOutputSchema },
  prompt: `You are an expert in finance and creating educational content. 
  Generate a short, fun quiz with {{count}} multiple-choice questions about personal finance, investing, and economics.
  The difficulty of the questions should be easy. These are for a quick daily challenge.
  
  For each question, provide exactly 4 answer options, and ensure that only one of them is correct.
  
  Please provide the output in the specified JSON format. Ensure the question IDs are unique.
  `,
});


const generateDailyQuizFlow = ai.defineFlow(
  {
    name: 'generateDailyQuizFlow',
    inputSchema: DailyQuizInputSchema,
    outputSchema: DailyQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate daily quiz questions.');
    }
    return output;
  }
);
