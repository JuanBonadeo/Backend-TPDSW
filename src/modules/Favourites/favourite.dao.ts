import { Favorite } from '@prisma/client';
import prisma from '../../db/db.js';
import { FavouriteDto } from './favourite.dtos.js';

export class FavouriteDAO {
    async getOne(favourite: FavouriteDto): Promise<Favorite | null> {
        return prisma.favorite.findFirst({
            where: {
                id_user: favourite.id_user,
                id_movie: favourite.id_movie,
            },
        });
    }

    async getAllByUserId(id_user: string): Promise<Favorite[]> {
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

    async create(favourite: FavouriteDto): Promise<Favorite> {
        return prisma.favorite.create({
            data: {
                id_user: favourite.id_user,
                id_movie: favourite.id_movie,
            },
        });
    }

    async delete(favourite: FavouriteDto): Promise<Favorite | null> {
        return prisma.favorite.delete({
            where: {
                id_user_id_movie: {
                    id_user: favourite.id_user,
                    id_movie: favourite.id_movie,
                },
            },
        });
    }
}
