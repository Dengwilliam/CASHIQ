'use server';
/**
 * @fileOverview An AI flow for generating a social share image card.
 *
 * - generateShareImage - A function that generates an image for sharing quiz results.
 * - ShareImageInput - The input type for the generateShareImage function.
 * - ShareImageOutput - The return type for the generateShareImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ShareImageInputSchema = z.object({
  playerName: z.string().describe('The name of the player.'),
  score: z.number().describe('The final score or coins earned.'),
  quizType: z.enum(['weekly', 'daily']).describe('The type of quiz taken.'),
  badges: z.array(z.string()).optional().describe('An array of new badges awarded.'),
});
export type ShareImageInput = z.infer<typeof ShareImageInputSchema>;

// The output is now a data URI for a generated image.
const ShareImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type ShareImageOutput = z.infer<typeof ShareImageOutputSchema>;

export async function generateShareImage(input: ShareImageInput): Promise<ShareImageOutput> {
  return generateShareImageFlow(input);
}

// Helper to build the prompt string
const buildPrompt = (input: ShareImageInput): string => {
  let prompt = `A vibrant and celebratory social media share card for a finance quiz app named "CashIQ". The design should be modern, clean, and eye-catching with a dark theme. Prominently feature the text "CashIQ" with its logo (a brain-like 'C' with a dollar sign).

The main focus should be the player's achievement.
Player Name: "${input.playerName}"
Their ${input.quizType === 'weekly' ? 'Score' : 'Coins Earned'}: ${input.score}. This should be the largest text element.

Use an energetic color palette with a dark background, vibrant purple (#6B45F5) as the primary color, and bright yellow (#F5D02C) for accents. Include abstract geometric shapes or lines to add a sense of dynamism. The overall tone should be exciting and rewarding.
`;

  if (input.badges && input.badges.length > 0) {
    prompt += `\nInclude a small section that says "New Badge Unlocked: ${input.badges[0]}"`;
  }
  
  prompt += `\nEnsure all text is legible against the background. Aspect ratio 16:9.`;

  return prompt;
};


const generateShareImageFlow = ai.defineFlow(
  {
    name: 'generateShareImageFlow',
    inputSchema: ShareImageInputSchema,
    outputSchema: ShareImageOutputSchema,
  },
  async (input) => {
    const promptText = buildPrompt(input);

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: promptText,
      config: {
        // Aspect ratio for social media. 1:1 (square), 9:16 (story), 16:9 (landscape)
        aspectRatio: '16:9'
      }
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate share image.');
    }
    
    return { imageUrl: media.url };
  }
);
