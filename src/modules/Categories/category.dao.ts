import prisma from '../../db/db.js';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './category.interface.js';

export class CategoryDAO {
    async getAll(): Promise<Category[] | null> {
        const categories = await prisma.category.findMany();
        return categories;
    }

    async getById(id: number): Promise<Category | null> {
        const category = await prisma.category.findUnique({
            where: { id_category: id },
        });
        return category;
    }

    async add(category: CreateCategoryDto): Promise<Category | null> {
        const newCategory = await prisma.category.create({
            data: {
                name: category.name,
                description: category.description,
            },
        });
        return newCategory;
    }

    async update(id: number, updatedCategory: Category): Promise<Category | null> {
        const result = await prisma.category.update({
            where: { id_category: id },
            data: {
                name: updatedCategory.name,
                description: updatedCategory.description,
            },
        });
        return result;
    }

    async delete(id: number): Promise<Category> {
        const result = await prisma.category.delete({
            where: { id_category: id },
        });
        return result;
    }
}
