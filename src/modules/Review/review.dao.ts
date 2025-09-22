import { Review } from '@prisma/client';
import prisma from '../../db/db.js';
import { ReviewData, ReviewList, ReviewQueryDto, UpdateReviewDto } from './review.dtos.js';


export class ReviewDao {

    async getOne(reviewId: number): Promise<Review | null> {
        const result = await prisma.review.findUnique({
            where: { id_review: reviewId, deleted_at: null },
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
                deleted_at: null
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
                id_user,
                deleted_at: null
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

    async create(reviewData: ReviewData): Promise<Review | null> {
        const result = await prisma.review.create({
            data: reviewData,
        });
        return result;
    }

    async update(reviewId: number, reviewData: UpdateReviewDto): Promise<Review | null> {
        const result = await prisma.review.update({
            where: { id_review: reviewId, deleted_at: null },
            data: reviewData,
        });
        return result;
    }

    async delete(reviewId: number): Promise<Review | null> {
        return await prisma.review.update({
            where: { id_review: reviewId },
            data: { deleted_at: new Date() },
        });
    }

    async getAllReviewsPaginated(query: ReviewQueryDto): Promise<ReviewList> {
        const { page, limit } = query;

        const reviews = await prisma.review.findMany({
            where: { deleted_at: null },
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
            orderBy: {
                review_date: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await prisma.review.count();
    
    return {
            reviews,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total: total,
                limit
            },
        };
    }
}