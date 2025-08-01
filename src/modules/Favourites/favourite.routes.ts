import { Router } from 'express';
import { Request, Response } from 'express';
import { FavouriteController } from './favourite.controller.js';

export const router = Router();
const controller = new FavouriteController();

router.post('/', (req: Request, res: Response) => controller.create(req, res));

router.get('/user/:id_user', (req: Request, res: Response) => controller.getFavouritesByUserId(req, res));

router.delete('/', (req: Request, res: Response) => controller.delete(req, res));

router.put('/toggle', (req: Request, res: Response) => controller.toggleFavourite(req, res));
