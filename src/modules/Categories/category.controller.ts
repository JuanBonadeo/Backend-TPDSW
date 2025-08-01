// Agregar validacion de parametros
import { Category } from '@prisma/client';
import { CategoryDAO } from './category.dao.js';
import { Request, Response } from 'express';
import { categoryZodSchema, CreateCategoryDto } from './category.interface.js';
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse, zodErrorResponse } from '../../utils/ResponseHandler.js';
import z from 'zod';

export class CategoryController {
    private dao: CategoryDAO;

    constructor() {
        this.dao = new CategoryDAO();
    }

    async getAllCategories(req: Request, res: Response) {
        try {
            const result = await this.dao.getAll();
            if (!result || result.length === 0) {
                return notFoundResponse(res, 'Categorias no encontradas');
            }
            successResponse(res, result, 'Categorias obtenidas con éxito', 200);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al obtener las categorias', error as any);
        }
    }

    async getCategoryById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const idSchema = z.coerce.number().int().positive();
        const validation = idSchema.safeParse(id);
        if (!validation.success) {
            return zodErrorResponse(res, 'ID de categoria inválido', validation.error.errors);
        }

        try {
            const result = await this.dao.getById(id);

            if (!result) {
                return notFoundResponse(res, 'Categoria no encontrada');
            }

            successResponse(res, result, 'Categoria obtenida con éxito', 200);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al obtener la categoria', error as any);
        }
    }

    async addCategory(req: Request, res: Response) {
        const newCategory = req.body as CreateCategoryDto;
        const validation = categoryZodSchema.safeParse(newCategory);
        if (!validation.success) {
            return zodErrorResponse(res, 'Datos de categoria inválidos', validation.error.errors);
        }
        try {
            const result = await this.dao.add(newCategory);
            if (!result) {
                return notFoundResponse(res, 'Error al agregar la categoria');
            }

            successResponse(res, result, 'Categoria agregada correctamente', 201);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al agregar la categoria', error as any);
        }
    }

    async updateCategory(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const updatedData = req.body as Category;
        const validation = categoryZodSchema.safeParse(updatedData);
        if (!validation.success) {
            return zodErrorResponse(res, 'Datos de categoria inválidos', validation.error.errors);
        }

        try {
            const existingCategory = await this.dao.getById(id);
            if (!existingCategory) {
                return notFoundResponse(res, 'Categoria no encontrada');
            }
            const result = await this.dao.update(id, updatedData);
            if (!result) {
                return errorResponse(res, 'Error al actualizar la categoria', null, 400);
            }
            successResponse(res, result, 'Categoria actualizada correctamente', 201);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al actualizar la categoria', error as any);
        }
    }

    async deleteCategory(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const idSchema = z.coerce.number().int().positive();
        const validation = idSchema.safeParse(id);
        if (!validation.success) {
            return zodErrorResponse(res, 'ID de categoria inválido', validation.error.errors);
        }

        try {
            const existingCategory = await this.dao.getById(id);
            if (!existingCategory) {
                return notFoundResponse(res, 'Categoria no encontrada');
            }
            const result = await this.dao.delete(id);
            if (!result) {
                return errorResponse(res, 'Error al eliminar la categoria', null, 400);
            }
            successResponse(res, { message: 'Categoria eliminada correctamente' }, 'Categoria eliminada con éxito', 200);
        } catch (error) {
            internalServerErrorResponse(res, 'Error al eliminar la categoria', error as any);
        }
    }
}
