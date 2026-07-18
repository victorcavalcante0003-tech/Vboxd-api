import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().max(280, 'Post muito longo (máximo 280 caracteres)'),
  rate: z.int().min(0).max(10)
});