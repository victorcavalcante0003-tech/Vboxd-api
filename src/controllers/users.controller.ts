import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { updateProfileSchema } from '../schemas/user.schema';

export async function getMe(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, bio: true, avatarUrl: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  return res.json(user);
}

export async function updateMe(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const parsed = updateProfileSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
  }

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: parsed.data,
    select: { id: true, name: true, email: true, bio: true, avatarUrl: true, createdAt: true },
  });

  return res.json(user);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, bio: true, avatarUrl: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  return res.json(user);
}

export async function getUserPosts(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const posts = await prisma.post.findMany({
    where: { authorId: id },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return res.json({ posts, page, limit });
}