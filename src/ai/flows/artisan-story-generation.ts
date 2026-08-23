'use server';

/**
 * @fileOverview Generates an artisan's story using AI.
 *
 * - generateArtisanStory - A function that generates an artisan's story.
 * - ArtisanStoryInput - The input type for the generateArtisanStory function.
 * - ArtisanStoryOutput - The return type for the generateArtisanStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArtisanStoryInputSchema = z.object({
  name: z.string().describe("The artisan's name."),
  craft: z.string().describe("The artisan's primary craft."),
  region: z.string().describe('The region where the artisan is from.'),
});
export type ArtisanStoryInput = z.infer<typeof ArtisanStoryInputSchema>;

const ArtisanStoryOutputSchema = z.object({
  story: z.string().describe("The generated artisan's story."),
});
export type ArtisanStoryOutput = z.infer<typeof ArtisanStoryOutputSchema>;

export async function generateArtisanStory(input: ArtisanStoryInput): Promise<ArtisanStoryOutput> {
  return artisanStoryGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'artisanStoryGenerationPrompt',
  input: {schema: ArtisanStoryInputSchema},
  output: {schema: ArtisanStoryOutputSchema},
  prompt: `You are an expert storyteller who crafts compelling and heartfelt biographies for artisans. Generate a short, engaging story (around 50-70 words) for an artisan based on the following details. The story should be warm, personal, and highlight their passion and heritage.

Artisan's Name: {{{name}}}
Artisan's Craft: {{{craft}}}
Artisan's Region: {{{region}}}

Craft a narrative that captures the essence of their work and connects them to their cultural roots. For example, you can talk about how they learned the craft from their family, what inspires them, or the cultural significance of their work in their region.`,
});

const artisanStoryGenerationFlow = ai.defineFlow(
  {
    name: 'artisanStoryGenerationFlow',
    inputSchema: ArtisanStoryInputSchema,
    outputSchema: ArtisanStoryOutputSchema,
  },
  async (input: ArtisanStoryInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
