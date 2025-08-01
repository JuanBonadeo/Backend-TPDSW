import { Router } from 'express';
import { Request, Response } from 'express';
import { successResponse } from '../../utils/ResponseHandler';
import { FavouriteController } from './favourite.controller.js';

export const router = Router();
const controller = new FavouriteController();

router.post('/', controller.createFavourite.bind(controller));

router.get('/user/:id_user', controller.getFavouritesByUserId.bind(controller));

router.delete('/', controller.delete.bind(controller));

router.put('/toggle', controller.toggleFavourite.bind(controller));
