import { Prisma } from "@prisma/client";
import { Response } from "express";
import { ZodError } from "zod";
import { logger } from "./logger.js";

// Errores personalizados
export class NotFoundError extends Error {
  constructor(message = "Recurso no encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends Error {
  constructor(message = "Solicitud inválida") {
    super(message);
    this.name = "BadRequestError";
  }
}
export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Acceso prohibido") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Conflicto de datos") {
    super(message);
    this.name = "ConflictError";
  }
}


interface ApiError {
  success?: boolean;
  status: number;
  message: string;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  private static prismaErrorMessages: Record<string, ApiError> = {
    P2002: { status: 409, message: 'Violación de restricción única' },
    P2003: { status: 400, message: 'Clave foránea no válida' },
    P2014: { status: 400, message: 'Relación requerida faltante' },
    P2025: { status: 404, message: 'Registro no encontrado' },
    P2016: { status: 400, message: 'Error en la consulta' },
    P2021: { status: 400, message: 'Error de validación' },
    P2027: { status: 400, message: 'Error de tipo de dato' },
    P2028: { status: 400, message: 'Error de formato de datos' },
    P2030: { status: 400, message: 'Error de transacción' },
    P2031: { status: 400, message: 'Error de conexión a la base de datos' },
    P2032: { status: 400, message: 'Error de autenticación' },
    P2033: { status: 400, message: 'Error de autorización' },
    P2034: { status: 400, message: 'Error de permisos' },
    P2035: { status: 400, message: 'Error de integridad referencial' },
    P2036: { status: 400, message: 'Error de integridad de datos' },
    P2037: { status: 400, message: 'Error de integridad de esquema' },
    P2038: { status: 400, message: 'Error de integridad de transacción' },
  };

  static handle(error: unknown, res: Response): Response {
    // Loguea el error
    logger.error("Error atrapado por ErrorHandler", { error });
    // Errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const info = this.prismaErrorMessages[error.code] || {
        success: false,
        status: 500,
        message: 'Error de base de datos desconocido'
      };

      return res.status(info.status).json({
        success: false,
        error: info.message,
        code: error.code,
        details: error.meta
      });
    }

    // Errores de Zod
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        code: 'ZOD_VALIDATION_ERROR',
        details: error.issues.map(issue => ({
          field: issue.path.join('.') || 'root',
          message: issue.message,
          code: issue.code
        }))
      });
    }

    // Errores personalizados
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, error: error.message, code: 'NOT_FOUND' });
    }

    if (error instanceof BadRequestError) {
      return res.status(400).json({ success: false, error: error.message, code: 'BAD_REQUEST' });
    }

    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, error: error.message, code: 'UNAUTHORIZED' });
    }

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ success: false, error: error.message, code: 'FORBIDDEN' });
    }

    // Otro error genérico
    return res.status(500).json({
      success: false,
      error: error,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
