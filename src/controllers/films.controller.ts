import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export async function listFilms(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;

  const films = await prisma.film.findMany({
    where: search
      ? { title: { contains: search, mode: 'insensitive' } }
      : undefined,
    orderBy: { title: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return res.json({ films, page, limit });
}

export async function getFilmById(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const film = await prisma.film.findUnique({ where: { id } });

  if (!film) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }

  return res.json(film);
}