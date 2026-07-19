import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export async function likePost(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }

  const existingLike = await prisma.like.findUnique({
    where: { postId_userId: { postId: id, userId: req.userId } },
  });

  if (existingLike) {
    return res.status(409).json({ error: 'Você já curtiu este post' });
  }

  await prisma.like.create({
    data: { postId: id, userId: req.userId },
  });

  return res.status(201).json({ message: 'Post curtido' });
}

export async function unlikePost(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const existingLike = await prisma.like.findUnique({
    where: { postId_userId: { postId: id, userId: req.userId } },
  });

  if (!existingLike) {
    return res.status(404).json({ error: 'Curtida não encontrada' });
  }

  await prisma.like.delete({
    where: { postId_userId: { postId: id, userId: req.userId } },
  });

  return res.status(204).send();
}