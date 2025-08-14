import { Router } from 'express';
import { Request, Response } from 'express';
import { MovieActorController } from './movie-actor.controller.js';
import { AuthMiddleware } from '../../middleware/auth.js';

export const router = Router();
const controller = new MovieActorController();

router.use(AuthMiddleware.optionalAuth)

router.get('/movie/:movieId', (req: Request, res: Response) => controller.getActorsByMovie(req, res));

router.get('/actor/:actorId', (req: Request, res: Response) => controller.getMoviesByActor(req, res));


router.use(AuthMiddleware.authenticate, AuthMiddleware.authorize(['ADMIN']));
    
router.post('/', (req: Request, res: Response) => controller.create(req, res));

router.delete('/movie/:movieId/actor/:actorId', (req: Request, res: Response) => controller.delete(req, res));

router.put('/', (req: Request, res: Response) => controller.update(req, res));
