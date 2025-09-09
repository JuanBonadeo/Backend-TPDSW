import { Router } from 'express';
import { Request, Response } from 'express';
import { ToWatchController } from './toWatch.controller.js';
import { AuthMiddleware } from '../../middleware/auth.js'; // Corrige la ruta

export const router = Router();
const controller = new ToWatchController();

router.use(AuthMiddleware.authenticate);

router.get('/isToWatch/:id_movie', (req: Request, res: Response) => controller.isToWatch(req, res));

router.post('/', (req: Request, res: Response) => controller.create(req, res));

router.get('/', (req: Request, res: Response) => controller.getMyToWatch(req, res));

router.get('/user/:id_user', (req: Request, res: Response) => controller.getToWatchByUserId(req, res));

router.delete('/', (req: Request, res: Response) => controller.delete(req, res));

router.put('/toggle', (req: Request, res: Response) => controller.toggleToWatch(req, res));

router.get('/:id_movie', (req: Request, res: Response) => controller.isToWatch(req, res));
