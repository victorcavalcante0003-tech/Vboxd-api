import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createPost, getPostById, deletePost, getFeed } from '../controllers/log.controller';
import { likePost, unlikePost } from '../controllers/likes.controller';
import { createComment, listComments } from '../controllers/comments.controller';

const router = Router();

router.post('/', authMiddleware, createPost);


router.get('/feed', authMiddleware, getFeed);

router.get('/:id', getPostById);
router.delete('/:id', authMiddleware, deletePost);

router.post('/:id/like', authMiddleware, likePost);
router.delete('/:id/like', authMiddleware, unlikePost);

router.post('/:id/comments', authMiddleware, createComment);
router.get('/:id/comments', listComments);

export default router;