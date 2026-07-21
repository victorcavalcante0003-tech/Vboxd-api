import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export async function likeLog(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const log = await prisma.log.findUnique({ where: { id } });

  if (!log) {
    return res.status(404).json({ error: 'Log não encontrado' });
  }

  const existingLike = await prisma.like.findUnique({
    where: { logId_userId: { logId: id, userId: req.userId } },
  });

  if (existingLike) {
    return res.status(409).json({ error: 'Você já curtiu este log' });
  }

  await prisma.like.create({
    data: { logId: id, userId: req.userId },
  });

  return res.status(201).json({ message: 'Log curtido' });
}

export async function unlikeLog(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const existingLike = await prisma.like.findUnique({
    where: { logId_userId: { logId: id, userId: req.userId } },
  });

  if (!existingLike) {
    return res.status(404).json({ error: 'Curtida não encontrada' });
  }

  await prisma.like.delete({
    where: { logId_userId: { logId: id, userId: req.userId } },
  });

  return res.status(204).send();
}