// contextMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthUtils, JwtPayload } from '../utils/auth.js';

// Extender los tipos de Express para incluir nuestro contexto
declare global {
    namespace Express {
        interface Locals {
            context: RequestContext;
        }
    }
}

export interface RequestContext {
    endpoint: string;
    method: string;
    userId: string;
    userEmail?: string;
    userRole?: string;
    startTime: number;
    requestId: string;
}

export const contextMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Obtener información del usuario del token si existe
    let userInfo: Partial<JwtPayload> = {};
    const authHeader = req.headers.authorization;
    const token = AuthUtils.getTokenFromHeader(authHeader);
    
    if (token) {
        try {
            userInfo = AuthUtils.verifyToken(token);
        } catch (error) {
            // Si el token es inválido, continuamos como usuario anónimo
            userInfo = {};
        }
    }
    
    // Crear el contexto y almacenarlo en res.locals
    res.locals.context = {
        endpoint: req.originalUrl || req.path,
        method: req.method,
        userId: userInfo.userId || 'anonymous',
        userEmail: userInfo.email,
        userRole: userInfo.role,
        startTime,
        requestId
    } as RequestContext;
    
    next();
};

// Función helper para obtener el contexto desde cualquier lugar
export const getRequestContext = (res: Response): RequestContext => {
    return res.locals.context;
};

// Función helper para calcular el tiempo de ejecución
export const getExecutionTime = (context: RequestContext): number => {
    return Date.now() - context.startTime;
};