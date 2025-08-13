// src/middleware/errorLogger.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

// Extender la interfaz Request para incluir context
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: string;
            };
            startTime?: number;
            context?: {
                endpoint: string;
                method: string;
                userId: string;
                executionTime?: number;
            };
        }
    }
}

export class ErrorLoggerMiddleware {
    // Middleware para loguear todas las requests y preparar contexto
    static logRequest(req: Request, res: Response, next: NextFunction) {
        const startTime = Date.now();
        req.startTime = startTime;
        
        // Preparar contexto para usar en ResponseHandler
        req.context = {
            endpoint: req.url,
            method: req.method,
            userId: req.user?.userId || 'anonymous'
        };
        
        // Log de la request
        logger.info('Incoming request', {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?.userId || 'anonymous',
            timestamp: new Date().toISOString()
        });

        // Capturar el final de la response
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            
            // Actualizar el contexto con el tiempo de ejecución
            if (req.context) {
                req.context.executionTime = duration;
            }
            
            logger.info('Request completed', {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                userId: req.user?.userId || 'anonymous',
                success: res.statusCode < 400
            });
        });

        next();
    }

    // Middleware global para errores no capturados
    static handleUncaughtError(error: Error, req: Request, res: Response, next: NextFunction) {
        logger.error('Uncaught error in middleware', {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            request: {
                method: req.method,
                url: req.url,
                ip: req.ip,
                userId: req.user?.userId || 'anonymous'
            }
        });

        return ErrorHandler.handle(error, res, {
            endpoint: req.url,
            method: req.method,
            userId: req.user?.userId
        });
    }
}
