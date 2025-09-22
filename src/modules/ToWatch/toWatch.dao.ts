import prisma from '../../db/db.js';
import { ToWatch } from '@prisma/client';

interface ToWatchData {
    id_user: string;
    id_movie: number;
}

export class ToWatchDAO {

    async getAllByUserId(userId: string): Promise<ToWatch[] | null> {
        const toWatchList = await prisma.toWatch.findMany({
            where: { id_user: userId, deleted_at: null },
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
        return toWatchList;
    }

    async getOne(toWatchData: ToWatchData): Promise<ToWatch | null> {
        const toWatch = await prisma.toWatch.findUnique({
            where: {
                deleted_at: null,
                id_user_id_movie: {
                    id_user: toWatchData.id_user,
                    id_movie: toWatchData.id_movie
                }
            }
        });
        return toWatch;
    }

    async create(toWatchData: ToWatchData): Promise<ToWatch> {
        const newToWatch = await prisma.toWatch.create({
            data: {
                id_user: toWatchData.id_user,
                id_movie: toWatchData.id_movie
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
        return newToWatch;
    }

    async delete(toWatchData: ToWatchData): Promise<ToWatch> {
        const deletedToWatch = await prisma.toWatch.update({
            where: {
                id_user_id_movie: {
                    id_user: toWatchData.id_user,
                    id_movie: toWatchData.id_movie
                }
            },
            data: {
                deleted_at: new Date()
            }
        });
        return deletedToWatch;
    }
}