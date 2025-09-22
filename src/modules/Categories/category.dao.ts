import prisma from '../../db/db.js';
import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dtos.js';

export class CategoryDAO {
    async getAll(): Promise<Category[] | null> {
        const categories = await prisma.category.findMany({
            where: { deleted_at: null }
        });
        return categories;
    }

    async getOne(id: number): Promise<Category | null> {
        const category = await prisma.category.findUnique({
            where: { id_category: id, deleted_at: null },
        });
        return category;
    }

    async create(category: CreateCategoryDto): Promise<Category | null> {
        const newCategory = await prisma.category.create({
            data: {
                name: category.name,
                description: category.description,
            },
        });
        return newCategory;
    }

    async update(id: number, updatedCategory: UpdateCategoryDto): Promise<Category | null> {
        const result = await prisma.category.update({
            where: { id_category: id, deleted_at: null },
            data: {
                name: updatedCategory.name,
                description: updatedCategory.description,
            },
        });
        return result;
    }

    async delete(id: number): Promise<Category> {
        const result = await prisma.category.update({
            where: { id_category: id, deleted_at: null },
            data: { deleted_at: new Date() },
        });
        return result;
    }
}
