import { Router } from 'express';
import { Request, Response } from 'express';
import { MovieController } from './movie.controller.js';

export const router = Router();

const controller = new MovieController();

router.get('/', (req: Request, res: Response) => {
    controller.getAllMovies(req, res);
});

router.get('/search', (req: Request, res: Response) => {
    controller.listMovies(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
    controller.getMovieById(req, res);
});

router.post('/', (req: Request, res: Response) => {
    controller.addMovie(req, res);
});

router.patch('/:id', (req: Request, res: Response) => {
    controller.updateMovie(req, res);
});

router.delete('/:id', (req: Request, res: Response) => {
    controller.deleteMovie(req, res);
});
