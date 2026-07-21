import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { createLogSchema } from '../schemas/log.schema';
import { AppError } from '../utils/AppError';

export async function createLog(req: Request, res: Response) {
  if (!req.userId) throw new AppError('Não autenticado', 401);

  const parsed = createLogSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? 'Dados inválidos', 400);
  }

  const log = await prisma.log.create({
    data: {
      filmId: parsed.data.filmId,
      rate: parsed.data.rate,
      content: parsed.data.content,
      authorId: req.userId,
    },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });

  return res.status(201).json(log);
}

export async function getLogById(req: Request, res: Response) {
  const { id } = req.params;
  if (typeof id !== 'string') throw new AppError('ID inválido', 400);

  const log = await prisma.log.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!log) throw new AppError('Log não encontrado', 404);

  return res.json(log);
}

export async function deleteLog(req: Request, res: Response) {
  if (!req.userId) throw new AppError('Não autenticado', 401);

  const { id } = req.params;
  if (typeof id !== 'string') throw new AppError('ID inválido', 400);

  const log = await prisma.log.findUnique({ where: { id } });
  if (!log) throw new AppError('Log não encontrado', 404);
  if (log.authorId !== req.userId) {
    throw new AppError('Você não tem permissão para deletar este log', 403);
  }

  await prisma.log.delete({ where: { id } });
  return res.status(204).send();
}

export async function getFeed(req: Request, res: Response) {
  if (!req.userId) throw new AppError('Não autenticado', 401);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const following = await prisma.follow.findMany({
    where: { followerId: req.userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f: { followingId: string }) => f.followingId);

  const logs = await prisma.log.findMany({
    where: { authorId: { in: followingIds } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return res.json({ logs, page, limit });
}
