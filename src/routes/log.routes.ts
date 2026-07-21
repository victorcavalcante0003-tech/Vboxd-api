import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createLog, getLogById, deleteLog, getFeed } from '../controllers/log.controller';
import { likeLog, unlikeLog } from '../controllers/likes.controller';
import { createComment, listComments } from '../controllers/comments.controller';

const router = Router();

router.post('/', authMiddleware, createLog);

router.get('/feed', authMiddleware, getFeed);

router.get('/:id', getLogById);
router.delete('/:id', authMiddleware, deleteLog);

router.post('/:id/like', authMiddleware, likeLog);
router.delete('/:id/like', authMiddleware, unlikeLog);

router.post('/:id/comments', authMiddleware, createComment);
router.get('/:id/comments', listComments);

export default router;
