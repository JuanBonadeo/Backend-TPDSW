// src/utils/responseContext.ts
import { Request } from 'express';

export class ResponseContextHelper {
    /**
     * Extrae el contexto de la request para usar en ResponseHandler
     */
    static getContext(req: Request) {
        return {
            endpoint: req.url,
            method: req.method,
            userId: req.user?.userId || 'anonymous',
            executionTime: req.startTime ? Date.now() - req.startTime : undefined
        };
    }

    /**
     * Crea un contexto personalizado combinando datos de la request con datos adicionales
     */
    static createContext(req: Request, customData?: { endpoint?: string; userId?: string }) {
        const baseContext = this.getContext(req);
        return {
            ...baseContext,
            ...customData
        };
    }
}
