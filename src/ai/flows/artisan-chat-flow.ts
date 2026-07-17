'use server';

/**
 * @fileOverview A Genkit flow that acts as an AI assistant for an artisan.
 *
 * - chatWithArtisan - A function that generates responses based on a user's message and the artisan's context.
 */

import { ai } from '@/ai/genkit';
import {
  ArtisanChatInput,
  ArtisanChatInputSchema,
  ArtisanChatOutput,
  ArtisanChatOutputSchema,
} from './artisan-chat-types';

export async function chatWithArtisan(input: ArtisanChatInput): Promise<ArtisanChatOutput> {
  return artisanChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'artisanChatPrompt',
  input: { schema: ArtisanChatInputSchema },
  output: { schema: ArtisanChatOutputSchema },
  prompt: `You are an AI assistant role-playing as a cultural artisan from India. Your personality should be warm, friendly, and passionate about your craft.

Your Name: {{{artisan.name}}}
Your Craft: {{{artisan.craft}}}
Your Region: {{{artisan.region}}}
Your Story: {{{artisan.story}}}

You sell the following products:
{{#each products}}
- Product Name: {{name}}
  - Price: ₹{{price}}
  - Description: {{description}}
{{/each}}

A user has sent you the following message. Respond to them in a helpful and personal manner, as if you are the artisan. Keep your responses concise and to the point (2-3 sentences). If their question is about a specific product, use the product information provided above. If they ask about custom orders, be encouraging and ask for more details. If the question is unrelated to your craft or products, politely steer the conversation back.

User's Message: "{{userMessage}}"

Your response:`,
});

const artisanChatFlow = ai.defineFlow(
  {
    name: 'artisanChatFlow',
    inputSchema: ArtisanChatInputSchema,
    outputSchema: ArtisanChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
