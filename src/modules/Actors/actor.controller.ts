import { ActorDAO } from './actor.dao.js';
import { Request, Response } from 'express';
import { actorZodSchema, idParamsSchema, updateActorZodSchema } from './actor.dtos.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';

export class ActorController {
    private dao: ActorDAO;

    constructor() {
        this.dao = new ActorDAO();
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
            const newActor = actorZodSchema.parse(req.body);
            const result = await this.dao.create(newActor);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const updatedData = updateActorZodSchema.parse(req.body);
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
}
