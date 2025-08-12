import prisma from '../../db/db.js';
import { Favorite } from '@prisma/client';

interface FavouriteData {
    id_user: string;
    id_movie: number;
}

export class FavouriteDAO {
    
    async getAllByUserId(userId: string): Promise<Favorite[] | null> {
        const favourites = await prisma.favorite.findMany({
            where: { id_user: userId },
            include: {
                Movie: {
                    select: {
                        id_movie: true,
                        title: true,
                        poster_path: true,
                        release_date: true,
                        averageScore: true,
                        rating: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return favourites;
    }

    async getOne(favouriteData: FavouriteData): Promise<Favorite | null> {
        const favourite = await prisma.favorite.findUnique({
            where: {
                id_user_id_movie: {
                    id_user: favouriteData.id_user,
                    id_movie: favouriteData.id_movie
                }
            }
        });
        return favourite;
    }

    async create(favouriteData: FavouriteData): Promise<Favorite> {
        const newFavourite = await prisma.favorite.create({
            data: {
                id_user: favouriteData.id_user,
                id_movie: favouriteData.id_movie
            },
            include: {
                Movie: {
                    select: {
                        id_movie: true,
                        title: true,
                        poster_path: true,
                        release_date: true,
                        averageScore: true,
                        rating: true
                    }
                }
            }
        });
        return newFavourite;
    }

    async delete(favouriteData: FavouriteData): Promise<Favorite> {
        const deletedFavourite = await prisma.favorite.delete({
            where: {
                id_user_id_movie: {
                    id_user: favouriteData.id_user,
                    id_movie: favouriteData.id_movie
                }
            }
        });
        return deletedFavourite;
    }
}