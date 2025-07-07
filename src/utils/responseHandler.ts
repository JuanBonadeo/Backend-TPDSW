
import { Response } from 'express';
import { ApiResponse, SuccessResponse, ErrorResponse } from '../types/api.types';
import { ZodIssue } from 'zod';

// Estructura base de respuesta
export const createResponse = <T>(
  success: boolean, 
  data: T | null = null, 
  message: string = '', 
  errors: any[] | null = null
): ApiResponse<T> => {
  return {
    success,
    data: data || undefined,
    message,
    errors: errors || undefined,
    timestamp: new Date().toISOString()
  };
};

// Para respuestas exitosas
export const successResponse = <T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
  
  return res.status(statusCode).json(response);
};

// Para respuestas de error
export const errorResponse = (res: Response, message: (string ) = 'Error', errors: any[] | null = null, statusCode: number = 500): Response => {
  
  const response: ErrorResponse = {
    success: false,
    message,
    errors: errors || undefined,
    timestamp: new Date().toISOString()
  };
  
  return res.status(statusCode).json(response);
};

// para repuestas con validacion de zod
export const zodErrorResponse = (res: Response,message: string = 'Validation error', issues: ZodIssue[],  statusCode: number = 400): Response => {
  const response: ErrorResponse = {
    message,
    errors: issues,
    success: false,
    timestamp: new Date().toISOString()
  };
  
  return res.status(statusCode).json(response);
};




    

// Respuestas específicas para diferentes casos


export const notFoundResponse = ( res: Response, message: string = 'Resource not found'): Response => {
  return errorResponse(res, message, null, 404);
};
// error 500
export const internalServerErrorResponse = ( res: Response, message: string = 'Internal server error', error: any[] | null = null): Response => {
  return errorResponse(res, message, error, 500);
};


// export const badRequestResponse = (res: Response, message: string = 'Bad request', errors: any[] | null = null): Response => {  return errorResponse(res, message, errors, 400);
// };

// export const unauthorizedResponse = ( res: Response, message: string = 'Unauthorized'): Response => {
//   return errorResponse(res, message, null, 401);
// };