import { Response } from "express";
import { logger } from "./logger.js";

interface ResponseContext {
    endpoint?: string;
    method?: string;
    userId?: string;
    executionTime?: number;
}

export class ResponseHandler {
    private static logResponse(
        status: number, 
        message: string, 
        context?: ResponseContext,
        dataSize?: number
    ) {
        logger.info('Successful response sent', {
            response: {
                status,
                message,
                dataSize: dataSize || 0,
                timestamp: new Date().toISOString()
            },
            context: {
                endpoint: context?.endpoint || 'unknown',
                method: context?.method || 'unknown',
                userId: context?.userId || 'anonymous',
                executionTime: context?.executionTime ? `${context.executionTime}ms` : 'unknown'
            }
        });
    }

    static success<T>(
        res: Response,
        data: T,
        message: string = 'Operación exitosa',
        status: number = 200,
        context?: ResponseContext
    ): Response {
        // Calcular tamaño aproximado de datos
        const dataSize = data ? JSON.stringify(data).length : 0;
        
        // Loguear la respuesta exitosa
        this.logResponse(status, message, context, dataSize);
        
        return res.status(status).json({
            success: true,
            message,
            data
        });
    }

    static created<T>(
        res: Response,
        data: T,
        message: string = 'Recurso creado',
        context?: ResponseContext
    ): Response {
        return this.success(res, data, message, 201, context);
    }
    
    static updated<T>(
        res: Response,
        data: T,
        message: string = 'Recurso actualizado',
        context?: ResponseContext
    ): Response {
        return this.success(res, data, message, 200, context);
    }
    
    static deleted(
        res: Response,
        message: string = 'Recurso eliminado',
        context?: ResponseContext
    ): Response {
        // Loguear la respuesta de eliminación
        this.logResponse(204, message, context, 0);
        
        return res.status(204).json({
            success: true,
            message
        });
    }

    // Para respuestas paginadas
    static paginated<T>(
        res: Response,
        data: T[],
        total: number,
        page: number,
        pageSize: number,
        message = 'Datos paginados obtenidos',
        context?: ResponseContext
    ): Response {
        const dataSize = JSON.stringify(data).length;
        
        // Loguear respuesta paginada con información adicional
        logger.info('Paginated response sent', {
            response: {
                status: 200,
                message,
                dataSize,
                recordsCount: data.length,
                timestamp: new Date().toISOString()
            },
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            },
            context: {
                endpoint: context?.endpoint || 'unknown',
                method: context?.method || 'unknown',
                userId: context?.userId || 'anonymous',
                executionTime: context?.executionTime ? `${context.executionTime}ms` : 'unknown'
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
                totalPages: Math.ceil(total / pageSize)
            }
        });
    }
}
