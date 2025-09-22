import prisma from '../../db/db.js';
import { Director, Movie } from '@prisma/client';
import { CreateDirectorDto, UpdateDirectorDto } from './director.dtos.js';

export class DirectorDAO {
    async getAll(): Promise<Director[] | null> {
        const categories = await prisma.director.findMany({
            where: { deleted_at: null }
        });
        return categories;
    }

    async getOne(id: number): Promise<Director | null> {
        const director = await prisma.director.findUnique({
            where: { id_director: id, deleted_at: null },
            include: { Movie: {
                select: {
                    id_movie: true,
                    title: true,
                    release_date: true,
                    rating: true,
                    poster_path: true,
                },
            }},
        });
        return director;
    }

    async create(director: CreateDirectorDto): Promise<Director | null> {
        const newDirector = await prisma.director.create({
            data: director,
        });
        return newDirector;
    }

    async update(id: number, updatedDirector: UpdateDirectorDto): Promise<Director | null> {
        const result = await prisma.director.update({
            where: { id_director: id, deleted_at: null },
            data: updatedDirector,
        });
        return result;
    }

    async delete(id: number): Promise<Director> {
        const result = await prisma.director.update({
            where: { id_director: id, deleted_at: null },
            data: { deleted_at: new Date() },
        });
        return result;
    }
}
