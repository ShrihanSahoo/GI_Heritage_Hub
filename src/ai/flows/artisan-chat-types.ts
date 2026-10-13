import { z } from 'genkit';

const ArtisanSchema = z.object({
  id: z.string().optional().default('artisan'),
  name: z.string().optional().default('Artisan Master'),
  craft: z.string().optional().default('Traditional Indian Craft'),
  region: z.string().optional().default('India'),
  story: z.string().optional().default('Passionate guardian of authentic heritage crafting techniques.'),
});

const ProductSchema = z.object({
  id: z.string().optional().default('product'),
  name: z.string().optional().default('Handcrafted item'),
  price: z.coerce.number().optional().default(0),
  description: z.string().optional().default('Authentic handcrafted heritage product.'),
  craft: z.string().optional().default('Handicraft'),
});

export const ArtisanChatInputSchema = z.object({
  userMessage: z.string().describe('The message from the user.'),
  artisan: ArtisanSchema.default({}).describe("The artisan the user is chatting with."),
  products: z.array(ProductSchema).default([]).describe("A list of products made by the artisan."),
});

export type ArtisanChatInput = z.infer<typeof ArtisanChatInputSchema>;

export const ArtisanChatOutputSchema = z.object({
  response: z.string().describe("The artisan's AI-generated response."),
});
export type ArtisanChatOutput = z.infer<typeof ArtisanChatOutputSchema>;
