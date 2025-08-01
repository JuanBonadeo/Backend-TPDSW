import { ActorDAO } from './actor.dao.js';
import { Request, Response } from 'express';
import { actorZodSchema, idParamsSchema, updateActorZodSchema } from './actor.dtos.js';
import { ResponseHandler } from '../../utils/ResponseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';

export class ActorController {
    private dao: ActorDAO;

    constructor() {
        this.dao = new ActorDAO();
    }

    async getAllActors(req: Request, res: Response) {
        try {
            const result = await this.dao.getAll();
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getActorById(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const result = await this.dao.getById(id);

            if (!result) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async addActor(req: Request, res: Response) {
        try {
            const newActor = actorZodSchema.parse(req.body);
            const result = await this.dao.add(newActor);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async updateActor(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const updatedData = updateActorZodSchema.partial().parse(req.body);
            const result = await this.dao.update(id, updatedData);
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async deleteActor(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            await this.dao.delete(id);
            return ResponseHandler.deleted(res);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }
}
