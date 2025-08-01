import { Router } from 'express';
import { Request, Response } from 'express';
import { ActorController } from './actor.controller.js';

export const router = Router();

const controller = new ActorController();

router.get('/', (req: Request, res: Response) => controller.getAll(req, res));

router.get('/:id', (req: Request, res: Response) => controller.getOne(req, res));

router.post('/', (req: Request, res: Response) => controller.create(req, res));

router.patch('/:id', (req: Request, res: Response) => controller.update(req, res));

router.delete('/:id', (req: Request, res: Response) => controller.delete(req, res));
