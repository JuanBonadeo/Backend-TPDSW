import { Request, Response } from 'express';
import { ReviewDao } from './review.dao.js';
import { ResponseHandler } from '../../utils/ResponseHandler.js';
import { ErrorHandler, NotFoundError } from '../../utils/ErrorHandler.js';
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
            const idUser = idUserParamsSchema.parse(req.params.id);
            const result = await this.dao.getReviewsByUserId(idUser);
            if (!result) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const newReview = reviewZodSchema.parse(req.body);
            const result = await this.dao.create(newReview);
            return ResponseHandler.created(res, result);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = idParamsSchema.parse(req.params.id);
            const updatedFavourite = reviewUpdateZodSchema.parse(req.body);
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
            const reviewId = idParamsSchema.parse(req.params.id);
            await this.dao.delete(reviewId);
            return ResponseHandler.deleted(res);
        } catch (error) {
            return ErrorHandler.handle(error, res);
        }
    }

}
