// src/utils/asyncHandler.ts

import { Request, Response, NextFunction } from 'express';

// Tipo para funciones async del controlador
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Wrapper para manejar errores async automáticamente
export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Clase de error personalizada
export class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors?: any[];
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    errors?: any[],
    isOperational: boolean = true,
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}