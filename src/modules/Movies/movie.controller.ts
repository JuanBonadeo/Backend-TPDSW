// Agregar validacion de parametros
import { Request, Response } from 'express';
import { MovieDAO } from './movie.dao.js';
import { idParamsSchema, movieZodSchema, movieZodSchemaQuery } from './movie.dtos.js';
import { ResponseHandler } from '../../utils/ResponseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';


export class MovieController {
    private dao: MovieDAO;     

    constructor() {
        this.dao = new MovieDAO(); 
    }

    async getAll(req: Request, res: Response) {
            try {
                const result = await this.dao.getAll();
                return ResponseHandler.success(res, result);
            } catch (error) {
                return ErrorHandler.handle(error, res);
            }
        }
    
        async getOne(req: Request, res: Response) {
            try {
                const id = idParamsSchema.parse(req.params.id);
                const result = await this.dao.getOne(id);
    
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
                const newMovie = movieZodSchema.parse(req.body);
                const result = await this.dao.create(newMovie);
                return ResponseHandler.created(res, result);
            } catch (error) {
                return ErrorHandler.handle(error, res);
            }
        }
    
        async update(req: Request, res: Response) {
            try {
                const id = idParamsSchema.parse(req.params.id);
                const updatedData = movieZodSchema.parse(req.body);
                const result = await this.dao.update(id, updatedData);
                return ResponseHandler.success(res, result);
            } catch (error) {
                return ErrorHandler.handle(error, res);
            }
        }
    
        async delete(req: Request, res: Response) {
            try {
                const id = idParamsSchema.parse(req.params.id);
                await this.dao.delete(id);
                return ResponseHandler.deleted(res);
            } catch (error) {
                return ErrorHandler.handle(error, res);
            }
        }

    async listMovies(req: Request, res: Response) {
        try {
            const query = movieZodSchemaQuery.parse(req.query);
            const result = await this.dao.listMovies(query);
            if (!result) {
                throw new NotFoundError('No se encontraron películas con los filtros proporcionados');
            }
            return ResponseHandler.paginated(
                res, 
                result.movies, 
                result.movies.length, 
                query.page, 
                query.limit,
            );
        } catch (error) {
           return ErrorHandler.handle(error, res);
        }
    }
}
