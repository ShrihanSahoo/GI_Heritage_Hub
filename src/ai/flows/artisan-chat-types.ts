import { z } from 'genkit';

const ArtisanSchema = z.object({
  id: z.string(),
  name: z.string(),
  craft: z.string(),
  region: z.string(),
  story: z.string(),
});

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  craft: z.string(),
});

export const ArtisanChatInputSchema = z.object({
  userMessage: z.string().describe('The message from the user.'),
  artisan: ArtisanSchema.describe("The artisan the user is chatting with."),
  products: z.array(ProductSchema).describe("A list of products made by the artisan."),
});
export type ArtisanChatInput = z.infer<typeof ArtisanChatInputSchema>;

export const ArtisanChatOutputSchema = z.object({
  response: z.string().describe("The artisan's AI-generated response."),
});
export type ArtisanChatOutput = z.infer<typeof ArtisanChatOutputSchema>;
