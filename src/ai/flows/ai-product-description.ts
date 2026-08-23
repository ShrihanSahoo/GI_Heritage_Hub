'use server';

/**
 * @fileOverview Generates product descriptions in multiple Indian languages using AI.
 *
 * - generateProductDescription - A function that generates product descriptions.
 * - AIProductDescriptionInput - The input type for the generateProductDescription function.
 * - AIProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productCategory: z.string().describe('The category of the product.'),
  productFeatures: z.string().describe('Key features of the product.'),
  productMaterials: z.string().describe('Materials used to create the product.'),
  productRegion: z.string().describe('The region where the product is made.'),
  targetLanguage: z.string().describe('The language in which to generate the description.'),
});
export type AIProductDescriptionInput = z.infer<typeof AIProductDescriptionInputSchema>;

const AIProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated product description.'),
});
export type AIProductDescriptionOutput = z.infer<typeof AIProductDescriptionOutputSchema>;

export async function generateProductDescription(input: AIProductDescriptionInput): Promise<AIProductDescriptionOutput> {
  return aiProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProductDescriptionPrompt',
  input: {schema: AIProductDescriptionInputSchema},
  output: {schema: AIProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in crafting compelling product descriptions for handcrafted items from India. You will generate a product description based on the information provided, tailored to attract customers interested in authentic Indian crafts. The product description should highlight the unique qualities of the product, its origin, and the artisan's story.

Product Name: {{{productName}}}
Category: {{{productCategory}}}
Key Features: {{{productFeatures}}}
Materials: {{{productMaterials}}}
Region: {{{productRegion}}}

Please generate the description in {{{targetLanguage}}}.`,
});

const aiProductDescriptionFlow = ai.defineFlow(
  {
    name: 'aiProductDescriptionFlow',
    inputSchema: AIProductDescriptionInputSchema,
    outputSchema: AIProductDescriptionOutputSchema,
  },
  async (input: AIProductDescriptionInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
