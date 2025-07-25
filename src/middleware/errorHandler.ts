import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseHandler';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    let error = { ...err };
    error.message = err.message;

    // Log del error para debugging
    console.error('Error:', err);

    // Respuesta de error
    errorResponse(res, error.message || 'Server Error', error.errors || null, error.statusCode || 500);
};
