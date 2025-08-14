import { Router } from 'express';
import { Request, Response } from 'express';
import { ActorController } from './actor.controller.js';
import { AuthMiddleware } from '../../middleware/auth.js';

export const router = Router();

const controller = new ActorController();

router.use(AuthMiddleware.optionalAuth)

router.get('/', (req: Request, res: Response) => controller.getAll(req, res));

router.get('/:id', (req: Request, res: Response) => controller.getOne(req, res));


router.use(AuthMiddleware.authenticate, AuthMiddleware.authorize(['ADMIN']));

router.post('/', (req: Request, res: Response) => controller.create(req, res));

router.patch('/:id', (req: Request, res: Response) => controller.update(req, res));

router.delete('/:id', (req: Request, res: Response) => controller.delete(req, res));
