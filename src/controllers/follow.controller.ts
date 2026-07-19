import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export async function followUser(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (id === req.userId) {
    return res.status(400).json({ error: 'Você não pode seguir a si mesmo' });
  }

  const userToFollow = await prisma.user.findUnique({ where: { id } });

  if (!userToFollow) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const existingFollow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: req.userId, followingId: id } },
  });

  if (existingFollow) {
    return res.status(409).json({ error: 'Você já segue este usuário' });
  }

  await prisma.follow.create({
    data: { followerId: req.userId, followingId: id },
  });

  return res.status(201).json({ message: 'Usuário seguido com sucesso' });
}

export async function unfollowUser(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const existingFollow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: req.userId, followingId: id } },
  });

  if (!existingFollow) {
    return res.status(404).json({ error: 'Você não segue este usuário' });
  }

  await prisma.follow.delete({
    where: { followerId_followingId: { followerId: req.userId, followingId: id } },
  });

  return res.status(204).send();
}

export async function listFollowers(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const followers = await prisma.follow.findMany({
    where: { followingId: id },
    include: {
      follower: { select: { id: true, name: true, avatarUrl: true, bio: true } },
    },
  });

  return res.json(followers.map((f) => f.follower));
}

export async function listFollowing(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const following = await prisma.follow.findMany({
    where: { followerId: id },
    include: {
      following: { select: { id: true, name: true, avatarUrl: true, bio: true } },
    },
  });

  return res.json(following.map((f) => f.following));
}