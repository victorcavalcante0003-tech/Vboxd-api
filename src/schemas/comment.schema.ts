import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'O comentário não pode estar vazio').max(280, 'Comentário muito longo'),
});