import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { deleteComment } from '../controllers/comments.controller';
import { createComment, listComments } from '../controllers/comments.controller';

const router = Router();

router.post('/:id/comments', authMiddleware, createComment);
router.get('/:id/comments', listComments);
router.delete('/:id', authMiddleware, deleteComment);

export default router;