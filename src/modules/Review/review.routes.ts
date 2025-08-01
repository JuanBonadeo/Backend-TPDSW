import { Router } from 'express';
import { Request, Response } from 'express';
import { ReviewController } from './review.controller.js';


export const router = Router();
const controller = new ReviewController();

router.get('/:id', (req: Request, res: Response) => controller.getOne(req, res));

router.get('/user/:id', (req: Request, res: Response) => controller.getReviewsByUserId(req, res));

router.get('/movie/:id', (req: Request, res: Response) => controller.getReviewsByMovieId(req, res));

router.post('/', (req: Request, res: Response) => controller.create(req, res));

router.put('/:id', (req: Request, res: Response) => controller.update(req, res));

router.delete('/:id', (req: Request, res: Response) => controller.delete(req, res));
