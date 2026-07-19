import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { deleteComment } from '../controllers/comments.controller';

const router = Router();

router.delete('/:id', authMiddleware, deleteComment);

export default router;