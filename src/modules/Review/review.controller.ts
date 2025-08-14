import { Request, Response } from 'express';
import { ReviewDao } from './review.dao.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import { ErrorHandler, NotFoundError, UnauthorizedError } from '../../utils/ErrorHandler.js';
import { idParamsSchema, idUserParamsSchema, reviewUpdateZodSchema, reviewZodSchema } from './review.dtos.js';


export class ReviewController {
    private dao: ReviewDao;
    constructor() {
        this.dao = new ReviewDao();
    }

    async getOne(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const result = await this.dao.getOne(id);
            if (!result) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }
    async getReviewsByMovieId(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const result = await this.dao.getReviewsByMovieId(id);
            if (!result) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getReviewsByUserId(req: Request, res: Response) {
        try {
            const userId = idUserParamsSchema.parse(req.params.id);
            const result = await this.dao.getReviewsByUserId(userId);
            if (!result) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async getMyReviews(req: Request, res: Response) {
        try {
            const userId = req.user!.userId; 
            const result = await this.dao.getReviewsByUserId(userId);
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const userId = req.user!.userId; 
            const newReview = reviewZodSchema.parse(req.body);
            const reviewData = {
                ...newReview,
                id_user: userId
            };
            const result = await this.dao.create(reviewData);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const updatedFavourite = reviewUpdateZodSchema.parse(req.body);

            const review = await this.dao.getOne(id);
            if (!review) {
                throw new NotFoundError();
            }
            if (review.id_user !== req.user!.userId) {
                throw new UnauthorizedError();
            }
            
            const result = await this.dao.update(id, updatedFavourite);
            if (!result) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const review = await this.dao.getOne(id);
            if (!review) {
                throw new NotFoundError();
            }
            if (review.id_user !== req.user!.userId && req.user!.role !== 'ADMIN') {
                throw new UnauthorizedError();
            }

            await this.dao.delete(id);
            return ResponseHandler.deleted(res);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

}
