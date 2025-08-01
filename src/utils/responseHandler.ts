import { Response } from "express";

export class ResponseHandler {
    static success<T>(
        res: Response,
        data: T,
        message: string = 'Operación exitosa',
        status: number = 200
    ): Response {
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
        message = 'Datos paginados obtenidos'
    ): Response {
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
