import { Request, Response } from 'express';
import { FavouriteDAO } from './favourite.dao.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import { ErrorHandler, NotFoundError, ForbiddenError } from '../../utils/ErrorHandler.js';
import { 
    favouriteZodSchema, 
    idUserParamsSchema, 
    toggleFavouriteSchema 
} from './favourite.dtos.js';

export class FavouriteController {
    private dao: FavouriteDAO;
    
    constructor() {
        this.dao = new FavouriteDAO();
    }

    async getMyFavourites(req: Request, res: Response) {
        try {
            const userId = req.user!.userId; 
            const result = await this.dao.getAllByUserId(userId);
            
            return ResponseHandler.success(res, result || []);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getFavouritesByUserId(req: Request, res: Response) {
        try {
            const targetUserId = idUserParamsSchema.parse(req.params.id_user);
            const currentUserId = req.user!.userId;
            const userRole = req.user!.role;

            if (targetUserId !== currentUserId && userRole !== 'ADMIN') {
                throw new ForbiddenError('No tienes permisos para ver los favoritos de este usuario');
            }

            const result = await this.dao.getAllByUserId(targetUserId);
            return ResponseHandler.success(res, result || []);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { id_movie } = favouriteZodSchema.parse(req.body);
            const userId = req.user!.userId;

            const favouriteData = {
                id_user: userId,
                id_movie: id_movie
            };

            const result = await this.dao.create(favouriteData);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async toggleFavourite(req: Request, res: Response) {
        try {
            const { id_movie } = toggleFavouriteSchema.parse(req.body);
            const userId = req.user!.userId;

            const favouriteData = {
                id_user: userId,
                id_movie: id_movie
            };

            const existingFavourite = await this.dao.getOne(favouriteData);
            
            if (existingFavourite) {
                await this.dao.delete(favouriteData);
                return ResponseHandler.success(res, { 
                    action: 'removed',
                    message: 'Película eliminada de favoritos' 
                });
            } else {
                const response = await this.dao.create(favouriteData);
                return ResponseHandler.created(res, { 
                    action: 'added',
                    message: 'Película agregada a favoritos',
                    data: response 
                });
            }
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id_movie } = favouriteZodSchema.parse(req.body);
            const userId = req.user!.userId;

            const favouriteData = {
                id_user: userId,
                id_movie: id_movie
            };

            await this.dao.delete(favouriteData);
            return ResponseHandler.deleted(res);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }
}