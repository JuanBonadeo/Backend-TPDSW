import { Request, Response } from 'express';
import { DirectorDAO } from './director.dao.js';
import { directorZodSchema, idParamsSchema, updateDirectorZodSchema } from './director.dtos.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';


export class DirectorController {
    private dao: DirectorDAO;

    constructor() {
        this.dao = new DirectorDAO();
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
            const newDirector = directorZodSchema.parse(req.body);
            const result = await this.dao.create(newDirector);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const updatedData = updateDirectorZodSchema.parse(req.body);
            const result = await this.dao.update(id, updatedData);
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const result = await this.dao.delete(id);
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }
}

