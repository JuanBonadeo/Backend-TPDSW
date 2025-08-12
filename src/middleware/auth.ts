// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUtils, JwtPayload } from '../utils/auth.js';
import { ErrorHandler, ForbiddenError, UnauthorizedError } from '../utils/ErrorHandler.js';

// Extender la interfaz Request para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export class AuthMiddleware {
    static authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const token = AuthUtils.getTokenFromHeader(req.headers.authorization);
            
            if (!token) {
                throw new UnauthorizedError('Token no proporcionado');
            }

            const decoded = AuthUtils.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Token inválido');
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token expirado');
            }
            return ErrorHandler.handle(error, res);
        }
    }

    static authorize(roles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new UnauthorizedError('Usuario no autenticado');
            }

            if (!roles.includes(req.user.role)) {
                throw new ForbiddenError('No tienes permiso para acceder a este recurso');
            }

            next();
        };
    }

    static optionalAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const token = AuthUtils.getTokenFromHeader(req.headers.authorization);
            
            if (token) {
                const decoded = AuthUtils.verifyToken(token);
                req.user = decoded;
            }
            
            next();
        } catch (error) {
            // En auth opcional, si hay error con el token, simplemente continuamos sin user
            next();
        }
    }
}