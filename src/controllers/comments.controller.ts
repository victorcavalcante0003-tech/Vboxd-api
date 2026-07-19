import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { createCommentSchema } from '../schemas/comment.schema';

export async function createComment(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const parsed = createCommentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
  }

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }

  const comment = await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId: id,
      authorId: req.userId,
    },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  return res.status(201).json(comment);
}

export async function listComments(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  return res.json({ comments, page, limit });
}

export async function deleteComment(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) {
    return res.status(404).json({ error: 'Comentário não encontrado' });
  }

  if (comment.authorId !== req.userId) {
    return res.status(403).json({ error: 'Você não tem permissão para deletar este comentário' });
  }

  await prisma.comment.delete({ where: { id } });

  return res.status(204).send();
}