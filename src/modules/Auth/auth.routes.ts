// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthMiddleware } from '../../middleware/auth.js';

export const router = Router();

const controller = new AuthController();


// Rutas públicas
router.post('/register', (req: Request, res: Response) => controller.register(req, res));
router.post('/login', (req: Request, res: Response) => controller.login(req, res));

// Rutas protegidas
router.use(AuthMiddleware.authenticate);

router.get('/profile', (req: Request, res: Response) => controller.getProfile(req, res));
router.patch('/profile', (req: Request, res: Response) => controller.updateProfile(req, res));
router.post('/change-password', (req: Request, res: Response) => controller.changePassword(req, res));