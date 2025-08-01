import { Review } from '@prisma/client';
import prisma from '../../db/db.js';
import { CreateReviewDto, UpdateReviewDto } from './review.dtos.js';

export class ReviewDao {
    
    async getOne(reviewId: number): Promise<Review | null> {
        const result = await prisma.review.findUnique({
            where: { id_review: reviewId },
            include: {
                User: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                Movie: {
                    select: {
                        id_movie: true,
                        title: true,
                    },
                },
            },
        });
        return result;
    }

    async getReviewsByMovieId(movieId: number): Promise<Review[] | null> {
        const result = await prisma.review.findMany({
            where: {
                id_movie: movieId,
            },
            include: {
                User: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                review_date: 'desc',
            },
        });
        return result;
    }

    async getReviewsByUserId(id_user: string): Promise<Review[] | null> {
        const result = await prisma.review.findMany({
            where: {
                id_user
            },
            include: {
                Movie: {
                    select: {
                        id_movie: true,
                        title: true,
                    },
                },
            },
            orderBy: {
                review_date: 'desc',
            },
        });
        return result;
    }

    async create(reviewData: CreateReviewDto): Promise<Review | null> {
        const result = await prisma.review.create({
            data: reviewData,
        });
        return result;
    }

    async update(reviewId: number, reviewData: UpdateReviewDto): Promise<Review | null> {
        const result = await prisma.review.update({
            where: { id_review: reviewId },
            data: reviewData,
        });
        return result;
    }
    
    async delete(reviewId: number): Promise<Review | null> {
       return  await prisma.review.delete({
            where: { id_review: reviewId },
        });
    }
}