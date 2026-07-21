import { z } from 'zod';

export const addToWatchlistSchema = z.object({
  filmId: z.string().min(1, 'filmId é obrigatório'),
});
