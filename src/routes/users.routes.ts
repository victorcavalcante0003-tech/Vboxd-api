import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getMe, updateMe, getUserById, getUserLogs } from '../controllers/users.controller';
import { followUser, unfollowUser, listFollowers, listFollowing } from '../controllers/follow.controller';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);

router.post('/:id/follow', authMiddleware, followUser);
router.delete('/:id/follow', authMiddleware, unfollowUser);

router.get('/:id/followers', listFollowers);
router.get('/:id/following', listFollowing);

router.get('/:id/watchlist', getWatchlist);
router.post('/:id/watchlist', authMiddleware, addToWatchlist);
router.delete('/:id/watchlist/:filmId', authMiddleware, removeFromWatchlist);

router.get('/:id', getUserById);
router.get('/:id/logs', getUserLogs);

export default router;