import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { addToWatchlistSchema } from '../schemas/watchlist.schema';

export async function getWatchlist(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: { film: true },
  });

  return res.json({ watchlist, page, limit });
}

export async function addToWatchlist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (id !== req.userId) {
    return res.status(403).json({ error: 'Você não tem permissão para alterar a watchlist de outro usuário' });
  }

  const parsed = addToWatchlistSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
  }

  const film = await prisma.film.findUnique({ where: { id: parsed.data.filmId } });

  if (!film) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }

  const existing = await prisma.watchlist.findUnique({
    where: { userId_filmId: { userId: id, filmId: parsed.data.filmId } },
  });

  if (existing) {
    return res.status(409).json({ error: 'Filme já está na watchlist' });
  }

  const entry = await prisma.watchlist.create({
    data: { userId: id, filmId: parsed.data.filmId },
    include: { film: true },
  });

  return res.status(201).json(entry);
}

export async function removeFromWatchlist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id, filmId } = req.params;

  if (typeof id !== 'string' || typeof filmId !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (id !== req.userId) {
    return res.status(403).json({ error: 'Você não tem permissão para alterar a watchlist de outro usuário' });
  }

  const existing = await prisma.watchlist.findUnique({
    where: { userId_filmId: { userId: id, filmId } },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Filme não está na watchlist' });
  }

  await prisma.watchlist.delete({
    where: { userId_filmId: { userId: id, filmId } },
  });

  return res.status(204).send();
}
