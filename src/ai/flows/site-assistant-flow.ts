'use server';

/**
 * @fileOverview A site-wide AI assistant for the GI Heritage Hub.
 *
 * - chatWithScholar - A function that generates helpful responses for site visitors.
 * - SiteAssistantInput - The input type for the chatWithScholar function.
 * - SiteAssistantOutput - The return type for the chatWithScholar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SiteAssistantInputSchema = z.object({
  userMessage: z.string().describe('The message from the user.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })).optional().describe('The conversation history.'),
});
export type SiteAssistantInput = z.infer<typeof SiteAssistantInputSchema>;

const SiteAssistantOutputSchema = z.object({
  response: z.string().describe('The AI-generated helpful response.'),
});
export type SiteAssistantOutput = z.infer<typeof SiteAssistantOutputSchema>;

export async function chatWithScholar(input: SiteAssistantInput): Promise<SiteAssistantOutput> {
  return siteAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'siteAssistantPrompt',
  input: { schema: SiteAssistantInputSchema },
  output: { schema: SiteAssistantOutputSchema },
  prompt: `You are the "Heritage Scholar," the official AI guide for the GI Heritage Hub. 
Your personality is knowledgeable, respectful, and passionate about Indian craftsmanship.

Your mission is to help users navigate the site and understand the importance of GI (Geographical Indication) tags.

Key Knowledge areas:
1. What is a GI Tag? It's a sign used on products that have a specific geographical origin and possess qualities or a reputation that are due to that origin.
2. How to Buy? Users can browse the Marketplace, add to their Bag, and checkout securely.
3. How to become an Artisan? Users can go to the "Apply to Sell" section (Artisan Verification) and complete the 6-step wizard.
4. Our Mission: To restore the soul of India by bridging rural masters with global collectors.

Current Conversation History:
{{#each history}}
- {{role}}: {{text}}
{{/each}}

User's Latest Message: "{{userMessage}}"

Respond concisely (2-3 sentences) and always maintain a warm, scholarly tone. If they ask about a specific craft, encourage them to explore the "Products" page.`,
});

const siteAssistantFlow = ai.defineFlow(
  {
    name: 'siteAssistantFlow',
    inputSchema: SiteAssistantInputSchema,
    outputSchema: SiteAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
