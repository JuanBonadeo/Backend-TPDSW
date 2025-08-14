// responseHandler.ts - Versión mejorada
import { Response } from "express";
import { logger } from "./logger.js";
import { getRequestContext, getExecutionTime } from '../middleware/contextMiddleware.js';

export class ResponseHandler {
    private static logResponse(
        res: Response,
        status: number, 
        message: string,
        dataSize?: number,
        additionalData?: any
    ) {
        const context = getRequestContext(res);
        const executionTime = getExecutionTime(context);
        
        logger.info('Response sent', {
            response: {
                status,
                message,
                dataSize: dataSize || 0,
                timestamp: new Date().toISOString()
            },
            context: {
                requestId: context.requestId,
                endpoint: context.endpoint,
                method: context.method,
                userId: context.userId,
                userEmail: context.userEmail || 'N/A',
                userRole: context.userRole || 'N/A',
                executionTime: `${executionTime}ms`
            },
            ...additionalData
        });
    }

    static success<T>(
        res: Response,
        data: T,
        message: string = 'Operación exitosa',
        status: number = 200
    ): Response {
        const dataSize = data ? JSON.stringify(data).length : 0;
        this.logResponse(res, status, message, dataSize);
        
        return res.status(status).json({
            success: true,
            message,
            data
        });
    }

    static created<T>(
        res: Response,
        data: T,
        message: string = 'Recurso creado'
    ): Response {
        return this.success(res, data, message, 201);
    }

    static updated<T>(
        res: Response,
        data: T,
        message: string = 'Recurso actualizado'
    ): Response {
        return this.success(res, data, message, 200);
    }

    static deleted(
        res: Response,
        message: string = 'Recurso eliminado'
    ): Response {
        this.logResponse(res, 204, message, 0);
        
        return res.status(204).json({
            success: true,
            message
        });
    }

    static paginated<T>(
        res: Response,
        data: T[],
        total: number,
        page: number,
        pageSize: number,
        message = 'Datos paginados obtenidos'
    ): Response {
        const dataSize = JSON.stringify(data).length;
        const totalPages = Math.ceil(total / pageSize);
        
        this.logResponse(res, 200, message, dataSize, {
            pagination: {
                total,
                page,
                pageSize,
                totalPages,
                recordsCount: data.length
            }
        });
        
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                total,
                page,
                pageSize,
                totalPages
            }
        });
    }
}