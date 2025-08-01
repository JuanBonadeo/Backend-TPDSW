import { Request, Response } from 'express';
import { CategoryDAO } from './category.dao.js';
import { categoryZodSchema, CreateCategoryDto, idParamsSchema, updateCategoryZodSchema } from './category.dtos.js';
import { ResponseHandler } from '../../utils/ResponseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';

export class CategoryController {
    private dao: CategoryDAO;

    constructor() {
        this.dao = new CategoryDAO();
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
            const result = await this.dao.getById(id);
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
            const newCategory = categoryZodSchema.parse(req.body);
            const result = await this.dao.add(newCategory);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const updatedData = updateCategoryZodSchema.parse(req.body);
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
