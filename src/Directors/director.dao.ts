import prisma from '../db/db.js';
import { Director } from '@prisma/client';
import { CreateDirectorDto } from './director.interface.js';

export class DirectorDAO {
    async getAll(): Promise<Director[] | null> {
        const categories = await prisma.director.findMany();
        return categories;
    }

    async getById(id: number): Promise<Director | null> {
        const director = await prisma.director.findUnique({
            where: { id_director: id },
        });
        return director;
    }

    async add(director: CreateDirectorDto): Promise<Director | null> {
        const newDirector = await prisma.director.create({
            data: {
                first_name: director.first_name,
                last_name: director.last_name,
            },
        });
        return newDirector;
    }

    async update(id: number, updatedDirector: Director): Promise<Director | null> {
        const result = await prisma.director.update({
            where: { id_director: id },
            data: {
                first_name: updatedDirector.first_name,
                last_name: updatedDirector.last_name,
                nationality: updatedDirector.nationality,
            },
        });
        return result;
    }

    async delete(id: number): Promise<Director> {
        const result = await prisma.director.delete({
            where: { id_director: id },
        });
        return result;
    }
}
