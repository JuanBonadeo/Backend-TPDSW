import { Request, Response } from 'express';
import { FavouriteDAO } from './favourite.dao.js';

import { ResponseHandler } from '../../utils/ResponseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';
import { favouriteZodSchema, idParamsSchema, idUserParamsSchema } from './favourite.dtos.js';

export class FavouriteController {
    private dao: FavouriteDAO;
    constructor() {
        this.dao = new FavouriteDAO();
    }


    async getFavouritesByUserId(req: Request, res: Response) {
        try {
            const idUser = idUserParamsSchema.parse(req.params.id);
            const result = await this.dao.getAllByUserId(idUser);
            if (!result) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const newFavourite = favouriteZodSchema.parse(req.body);
            const result = await this.dao.create(newFavourite);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async toggleFavourite(req: Request, res: Response) {
        try {
            const favourite = favouriteZodSchema.parse(req.body);

            const existingFavourite = await this.dao.getOne(favourite);
            if (existingFavourite) {
                await this.dao.delete(favourite);
                return ResponseHandler.deleted(res);
            } else {
                const response = await this.dao.create(favourite);
                return ResponseHandler.created(res, response);
            }
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const favourite = favouriteZodSchema.parse(req.body);
            await this.dao.delete(favourite);
            return ResponseHandler.deleted(res);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

}
