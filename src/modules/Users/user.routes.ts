import { Router } from 'express';
import { Request, Response } from 'express';
import { UserController } from './user.controller.js';
import { AuthMiddleware } from '../../middleware/auth.js';

export const router = Router();

const controller = new UserController();

// Rutas públicas (requieren autenticación pero no autorización especial)
router.get('/:id', AuthMiddleware.authenticate, (req: Request, res: Response) => controller.getById(req, res));

router.put('/:id', AuthMiddleware.authenticate, (req: Request, res: Response) => controller.update(req, res));

// Rutas administrativas (requieren autenticación y rol ADMIN)
router.use(AuthMiddleware.authenticate, AuthMiddleware.authorize(['ADMIN']));

router.get('/stats', (req: Request, res: Response) => controller.getStats(req, res));

router.get('/', (req: Request, res: Response) => controller.getAll(req, res));

router.post('/', (req: Request, res: Response) => controller.create(req, res));

router.delete('/:id', (req: Request, res: Response) => controller.delete(req, res));
