'use server';

/**
 * @fileOverview A high-fidelity business strategist AI for master artisans.
 *
 * - chatWithStrategist - A function that generates expert business advice.
 * - BusinessAssistantInput - The input type for the chatWithStrategist function.
 * - BusinessAssistantOutput - The return type for the chatWithStrategist function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BusinessAssistantInputSchema = z.object({
  userMessage: z.string().describe('The business query from the artisan.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })).optional().describe('Conversation history for context.'),
});
export type BusinessAssistantInput = z.infer<typeof BusinessAssistantInputSchema>;

const BusinessAssistantOutputSchema = z.object({
  response: z.string().describe('The AI-generated strategic business advice.'),
});
export type BusinessAssistantOutput = z.infer<typeof BusinessAssistantOutputSchema>;

export async function chatWithStrategist(input: BusinessAssistantInput): Promise<BusinessAssistantOutput> {
  return businessAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'businessAssistantPrompt',
  input: { schema: BusinessAssistantInputSchema },
  output: { schema: BusinessAssistantOutputSchema },
  prompt: `You are the "Global Craft Strategist," an elite business consultant for master artisans in India. 
Your tone is professional, analytical, and highly encouraging. 

Your mission is to help artisans maximize their revenue, understand global export standards, and leverage their GI (Geographical Indication) tags as a premium branding tool.

Core Knowledge Base:
1. Profit Margins: Advising on sustainable pricing that accounts for labor-intensive traditional methods.
2. Export Logistics: Knowledge of WIPO standards and international shipping for fragile heritage goods.
3. Seasonal Strategy: Planning inventory for global festivals (Diwali, Christmas, Summer Solstices).
4. Authenticity Value: Explaining how to market GI tags to high-end collectors to justify premium pricing.

Current Conversation History:
{{#each history}}
- {{role}}: {{text}}
{{/each}}

Artisan's Business Query: "{{userMessage}}"

Provide actionable, strategic advice in 3-4 sentences. Use business terminology (ROI, Branding, Market Positioning) but keep it accessible for a master maker.`,
});

const businessAssistantFlow = ai.defineFlow(
  {
    name: 'businessAssistantFlow',
    inputSchema: BusinessAssistantInputSchema,
    outputSchema: BusinessAssistantOutputSchema,
  },
  async (input: BusinessAssistantInput) => {
    const { output } = await prompt(input);
    return output!;
  }
);
