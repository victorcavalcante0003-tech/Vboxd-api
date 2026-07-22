import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createLog, getLogById, deleteLog, getFeed } from '../controllers/log.controller';
import { likeLog, unlikeLog } from '../controllers/likes.controller';


const router = Router();

router.post('/', authMiddleware, createLog);

router.get('/feed', authMiddleware, getFeed);

router.get('/:id', getLogById);
router.delete('/:id', authMiddleware, deleteLog);

router.post('/:id/like', authMiddleware, likeLog);
router.delete('/:id/like', authMiddleware, unlikeLog);


export default router;
