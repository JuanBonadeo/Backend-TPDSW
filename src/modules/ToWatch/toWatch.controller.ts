import { Request, Response } from 'express';
import { ToWatchDAO } from './toWatch.dao.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import { ErrorHandler, NotFoundError, ForbiddenError } from '../../utils/ErrorHandler.js';
import { toWatchZodSchema, idParamsSchema, idUserParamsSchema, toggleToWatchSchema } from './toWatch.dtos';

export class ToWatchController {
    private dao: ToWatchDAO;

    constructor() {
        this.dao = new ToWatchDAO();
    }

    async getMyToWatch(req: Request, res: Response) {
        try {
            const userId = req.user!.userId; 
            const result = await this.dao.getAllByUserId(userId);
            
            return ResponseHandler.success(res, result || []);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getToWatchByUserId(req: Request, res: Response) {
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
            const { id_movie } = toWatchZodSchema.parse(req.body);
            const userId = req.user!.userId;

            const toWatchData = {
                id_user: userId,
                id_movie: id_movie
            };

            const result = await this.dao.create(toWatchData);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async toggleToWatch(req: Request, res: Response) {
        try {
            const { id_movie } = toggleToWatchSchema.parse(req.body);
            const userId = req.user!.userId;

            const toWatchData = {
                id_user: userId,
                id_movie: id_movie
            };

            const existingToWatch = await this.dao.getOne(toWatchData);

            if (existingToWatch) {
                await this.dao.delete(toWatchData);
                return ResponseHandler.success(res, {
                    action: 'removed',
                    message: 'Película eliminada de la watchlist'
                });
            } else {
                const response = await this.dao.create(toWatchData);
                return ResponseHandler.created(res, { 
                    action: 'added',
                    message: 'Película agregada a la watchlist',
                    data: response
                });
            }
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id_movie } = toWatchZodSchema.parse(req.body);
            const userId = req.user!.userId;

            const toWatchData = {
                id_user: userId,
                id_movie: id_movie
            };

            await this.dao.delete(toWatchData);
            return ResponseHandler.deleted(res);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async isToWatch(req: Request, res: Response) {
        try {
            const  id_movie = idParamsSchema.parse(req.params.id_movie);
            const userId = req.user!.userId;

            const toWatchData = {
                id_user: userId,
                id_movie: id_movie
            };

            const existingToWatch = await this.dao.getOne(toWatchData);
            return ResponseHandler.success(res, { isToWatch: !!existingToWatch });
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }
}