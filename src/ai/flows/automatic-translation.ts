'use server';

/**
 * @fileOverview Implements the automatic translation flow for in-app chat.
 *
 * - translateMessage - Translates a given message from one language to another.
 * - AutomaticTranslationInput - The input type for the translateMessage function.
 * - AutomaticTranslationOutput - The return type for the translateMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticTranslationInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.string().describe('The language of the input text.'),
  targetLanguage: z.string().describe('The language to translate the text to.'),
});
export type AutomaticTranslationInput = z.infer<typeof AutomaticTranslationInputSchema>;

const AutomaticTranslationOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type AutomaticTranslationOutput = z.infer<typeof AutomaticTranslationOutputSchema>;

export async function translateMessage(input: AutomaticTranslationInput): Promise<AutomaticTranslationOutput> {
  return automaticTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automaticTranslationPrompt',
  input: {schema: AutomaticTranslationInputSchema},
  output: {schema: AutomaticTranslationOutputSchema},
  prompt: `Translate the following text from {{sourceLanguage}} to {{targetLanguage}}:\n\n{{text}}`,
});

const automaticTranslationFlow = ai.defineFlow(
  {
    name: 'automaticTranslationFlow',
    inputSchema: AutomaticTranslationInputSchema,
    outputSchema: AutomaticTranslationOutputSchema,
  },
  async (input: AutomaticTranslationInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
