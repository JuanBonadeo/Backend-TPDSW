import prisma from '../../db/db.js';
import { FavouriteDTO } from './favourite.interface.js';

export class FavouriteDAO {
    async getOne(id_user: string, id_movie: number): Promise<FavouriteDTO | null> {
        return prisma.favorite.findFirst({
            where: {
                id_user,
                id_movie,
            },
        });
    }

    async create(id_user: string, id_movie: number): Promise<FavouriteDTO> {
        return prisma.favorite.create({
            data: {
                id_user,
                id_movie,
            },
        });
    }

    async getAllByUserId(id_user: string): Promise<FavouriteDTO[]> {
        return prisma.favorite.findMany({
            where: { id_user },
            include: {
                Movie: {
                    select: {
                        id_movie: true,
                        title: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async delete(id_user: string, id_movie: number): Promise<FavouriteDTO | null> {
        return prisma.favorite.delete({
            where: {
                id_user_id_movie: {
                    id_user,
                    id_movie,
                },
            },
        });
    }
}
