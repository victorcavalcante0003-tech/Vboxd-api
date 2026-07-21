import { z } from 'zod';

export const createLogSchema = z.object({
  filmId: z.string(),
  rate: z.int().min(0).max(10),
  content: z.string().max(280, 'Log muito longo (máximo 280 caracteres)').optional(),
});