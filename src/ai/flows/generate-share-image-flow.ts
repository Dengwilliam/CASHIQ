'use server';
/**
 * @fileOverview An AI flow for generating a social share image card.
 *
 * - generateShareImage - A function that generates an SVG image for sharing quiz results.
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

const ShareImageOutputSchema = z.object({
  svg: z.string().describe('The generated SVG image as a string.'),
});
export type ShareImageOutput = z.infer<typeof ShareImageOutputSchema>;

export async function generateShareImage(input: ShareImageInput): Promise<ShareImageOutput> {
  return generateShareImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShareImagePrompt',
  input: { schema: ShareImageInputSchema },
  output: { schema: ShareImageOutputSchema },
  prompt: `You are an expert SVG designer. Create a visually appealing SVG image (600x315px) for sharing quiz results on social media.
The design should be vibrant, modern, and suitable for a gaming/finance app with a dark theme.

Use the Poppins font, which will be available.
The primary color is a vibrant purple (#6B45F5).
The accent color is a bright yellow (#F5D02C).
The background color is a dark charcoal (#1A1822).
The text color is a light off-white (#DCDAE1).

The SVG should include:
1.  A background rectangle with the dark charcoal color and rounded corners (rx="16").
2.  The app title "CashIQ" at the top, perhaps with the accent color.
3.  The player's name: "{{playerName}}".
4.  The final score: "{{score}}". This should be the most prominent element.
5.  A label indicating if it's the "Weekly Score" or "Daily Coins Earned", based on the quizType: "{{quizType}}".
6.  If there are badges, list up to 2 of them: {{#each badges}}"{{this}}" {{/each}}.
7.  Add some abstract, energetic background shapes using gradients of the primary and accent colors to make it look dynamic.

Structure the output as a valid SVG string within the JSON format. Do not include any markdown formatting like \`\`\`svg.

Example of a badge element if badges exist:
<text x="300" y="280" font-family="Poppins" font-size="14" fill="#DCDAE1" text-anchor="middle">New Badge: {{badges.[0]}}</text>

Make the score the largest and most eye-catching text element.
`,
});

const generateShareImageFlow = ai.defineFlow(
  {
    name: 'generateShareImageFlow',
    inputSchema: ShareImageInputSchema,
    outputSchema: ShareImageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate share image.');
    }
    // The model might wrap the SVG in markdown, so we clean it up.
    const cleanedSvg = output.svg.replace(/```svg\n?/, '').replace(/```$/, '').trim();
    return { svg: cleanedSvg };
  }
);
