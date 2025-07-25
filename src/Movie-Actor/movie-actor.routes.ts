import { Router } from 'express';
import { Request, Response } from 'express';
import { MovieActorController } from './movie-actor.controller.js';

export const router = Router();
const controller = new MovieActorController();

router.post('/', (req: Request, res: Response) => {
    controller.assignActorToMovie(req, res);
});

router.get('/movie/:movieId', (req: Request, res: Response) => {
    controller.getActorsByMovie(req, res);
});

router.get('/actor/:actorId', (req: Request, res: Response) => {
    controller.getMoviesByActor(req, res);
});


router.delete('/movie/:movieId/actor/:actorId', (req: Request, res: Response) => {
    controller.delete(req, res);
});

router.put('/', (req: Request, res: Response) => {
    controller.updateActorRole(req, res);
});
