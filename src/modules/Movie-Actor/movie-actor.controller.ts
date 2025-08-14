import { Request, Response } from 'express';
import { MovieActorDAO } from './movie-actor.dao.js';
import { idParamsSchema, movieActorZodSchema } from './movie-actor.dtos.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';


export class MovieActorController {
    private dao: MovieActorDAO;

    constructor() {
        this.dao = new MovieActorDAO();
    }

    async getActorsByMovie(req: Request, res: Response) {
        try {
            const movieId = idParamsSchema.parse(req.params.id);
            const result = await this.dao.getActorsByMovieId(movieId);
            if (!result) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getMoviesByActor(req: Request, res: Response) {
        try {
            const actorId = idParamsSchema.parse(req.params.id);
            const result = await this.dao.getMoviesByActorId(actorId);
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
            const newMovieActor = movieActorZodSchema.parse(req.body);
            const result = await this.dao.create(newMovieActor);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const movieId = idParamsSchema.parse(req.params.movieId);
            const actorId = idParamsSchema.parse(req.params.id);
            const updatedData = movieActorZodSchema.parse(req.body);
            const result = await this.dao.update(movieId, actorId, updatedData);
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const movieId = idParamsSchema.parse(req.params.movieId);
            const actorId = idParamsSchema.parse(req.params.id);
            await this.dao.delete(movieId, actorId);
            return ResponseHandler.deleted(res);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }
}
