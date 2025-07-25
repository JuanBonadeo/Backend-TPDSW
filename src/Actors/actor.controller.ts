// Agregar validacion de parametros
import { Actor } from '@prisma/client';
import { ActorDAO } from './actor.dao.js';
import { Request, Response } from 'express';
import { actorZodSchema, CreateActorDto } from './actor.interface.js';
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse, zodErrorResponse } from '../utils/responseHandler.js';

import { z } from 'zod';

export class ActorController {
    private dao: ActorDAO;

    constructor() {
        this.dao = new ActorDAO();
    }

    async getAllActors(req: Request, res: Response) {
        try {
            const result = await this.dao.getAll();

            if (!result || result.length === 0) {
                return notFoundResponse(res, 'No se encontraron actores');
            }
            return successResponse(res, result, 'Actores obtenidos con éxito', 200);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al obtener los actores', error as any);
        }
    }

    async getActorById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const idSchema = z.coerce.number().int().positive();
        const validation = idSchema.safeParse(id);

        if (!validation.success) {
            return zodErrorResponse(res, 'ID de actor inválido', validation.error.errors);
        }

        try {
            const result = await this.dao.getById(id);

            if (!result) {
                return notFoundResponse(res, 'Actor no encontrado');
            }
            successResponse(res, result, 'Actor obtenido con éxito', 200);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al obtener el actor', error as any);
        }
    }

    async addActor(req: Request, res: Response) {
        const newActor = req.body as CreateActorDto;
        const validation = actorZodSchema.safeParse(newActor);
        if (!validation.success) {
            return zodErrorResponse(res, 'Datos de actor inválidos', validation.error.errors);
        }
        try {
            const result = await this.dao.add(newActor);
            if (!result) {
                return notFoundResponse(res, 'Error al agregar el actor');
            }
            successResponse(res, result, 'Actor agregado correctamente', 201);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al agregar el actor', error as any);
        }
    }

    async updateActor(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const updatedData = req.body as Actor;
        const idSchema = z.coerce.number().int().positive();
        const validation = idSchema.safeParse(id);
        if (!validation.success) {
            return zodErrorResponse(res, 'ID de actor inválido', validation.error.errors);
        }

        const dataValidation = actorZodSchema.partial().safeParse(updatedData);
        if (!dataValidation.success) {
            return zodErrorResponse(res, 'Datos de actor inválidos', dataValidation.error.errors);
        }

        try {
            const existingActor = await this.dao.getById(id);
            if (!existingActor) {
                return notFoundResponse(res, 'Actor no encontrado');
            }
            const result = await this.dao.update(id, updatedData);
            if (!result) {
                return errorResponse(res, 'Error al actualizar el actor');
            }

            successResponse(res, result, 'Actor actualizado correctamente', 200);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al actualizar el actor', error as any);
        }
    }

    async deleteActor(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const idSchema = z.coerce.number().int().positive();
        const validation = idSchema.safeParse(id);
        if (!validation.success) {
            return zodErrorResponse(res, 'ID de actor inválido', validation.error.errors);
        }
        try {
            const existingActor = await this.dao.getById(id);
            if (!existingActor) {
                return notFoundResponse(res, 'Actor no encontrado');
            }
            const result = await this.dao.delete(id);
            if (!result) {
                return errorResponse(res, 'Error al eliminar el actor');
            }
            successResponse(res, { id }, 'Actor eliminado correctamente', 204);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al eliminar el actor', error as any);
        }
    }
}
