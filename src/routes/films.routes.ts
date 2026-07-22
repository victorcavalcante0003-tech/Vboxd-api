import { Router } from 'express';
import { listFilms, getFilmById } from '../controllers/films.controller';
 
const router = Router();
 
router.get('/', listFilms);
router.get('/:id', getFilmById);
 
export default router;
 