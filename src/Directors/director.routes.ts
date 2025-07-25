import { Router } from 'express';
import { Request, Response } from 'express';
import { DirectorController } from './director.controller.js';

export const router = Router();

const controller = new DirectorController();

router.get('/', (req: Request, res: Response) => {
    controller.getAllDirectors(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
    controller.getDirectorById(req, res);
});

router.post('/', (req: Request, res: Response) => {
    controller.addDirector(req, res);
});

router.patch('/:id', (req: Request, res: Response) => {
    controller.updateDirector(req, res);
});

router.delete('/:id', (req: Request, res: Response) => {
    controller.deleteDirector(req, res);
});
