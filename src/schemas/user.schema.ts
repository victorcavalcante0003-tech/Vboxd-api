import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').optional(),
  bio: z.string().max(280, 'Bio muito longa').optional(),
  avatarUrl: z.string().url('URL inválida').optional(),
});