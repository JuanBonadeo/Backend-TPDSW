// Agregar validacion de parametros
import { Director } from "@prisma/client";
import { DirectorDAO } from "./director.dao.js";
import { Request, Response } from "express";
import { CreateDirectorDto, directorZodSchema } from "./director.interface.js";
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse, zodErrorResponse } from "../utils/responseHandler.js";

import { z } from "zod";
import { error } from "console";



export class DirectorController {
  private dao: DirectorDAO;

  constructor() {
    this.dao = new DirectorDAO();
  }

  
  async getAllDirectors(req: Request, res: Response) {
    try {
      const result = await this.dao.getAll();
      if (!result || result.length === 0) {
        return notFoundResponse(res, "Directores no encontrados");
      }
      successResponse(res, result, "Directores obtenidos con éxito", 200);
    } catch (error) {
      internalServerErrorResponse(res, "Error al obtener los directores", error as any);
    }
  }


  async getDirectorById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const idSchema = z.coerce.number().int().positive();
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return zodErrorResponse(res, "ID de director inválido", validation.error.errors);
    }

    try {
      const result = await this.dao.getById(id);

      if (!result) {
        return notFoundResponse(res, "Director no encontrado");
        
      }
      successResponse(res, result, "Director obtenido con éxito", 200);
    } catch (error) {
      internalServerErrorResponse(res, "Error al obtener el director", error as any);
    }
  }


  async addDirector(req: Request, res: Response) {
    const newDirector = req.body as CreateDirectorDto;
    const validation = directorZodSchema.safeParse(newDirector);
    if (!validation.success) {
      return zodErrorResponse(res, "Datos de director inválidos", validation.error.errors);
    }
    try {
      const result = await this.dao.add(newDirector);
      if (!result) {
        return errorResponse(res, "Error al agregar el director", null, 400);
      }
      successResponse(res, result, "Director agregado correctamente", 201);
    } catch (error) {
      internalServerErrorResponse(res, "Error al agregar el director", error as any);
    }
  }


  async updateDirector(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updatedData = req.body as Director;
    const data = { ...updatedData, id };
    const validation = directorZodSchema.safeParse(data);
    if (!validation.success) {
      return zodErrorResponse(res, "Datos de director inválidos", validation.error.errors);
    }

    try {
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return notFoundResponse(res, "No se proporcionaron datos para actualizar el director");
      }

      const existingDirector = await this.dao.getById(id);
      if (!existingDirector) {
        return notFoundResponse(res, "Director no encontrado");
        
      }
      const result = await this.dao.update(id, updatedData);
      if (!result) {
        return errorResponse(res, "Error al actualizar el director", null, 400);
      }
      successResponse(res, result, "Director actualizado correctamente", 200);
    } catch (error) {
      internalServerErrorResponse(res, "Error al actualizar el director", error as any);
    }
  }


  async deleteDirector(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const idSchema = z.coerce.number().int().positive();
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return zodErrorResponse(res, "ID de director inválido", validation.error.errors);
    }

    try {
      const existingDirector = await this.dao.getById(id);
      if (!existingDirector) {
        return notFoundResponse(res, "Director no encontrado");
      }
      const result = await this.dao.delete(id);
      if (!result) {
        return errorResponse(res, "Error al eliminar el director", null, 400);
      }
      successResponse(res, { id }, "Director eliminado correctamente", 200);
    } catch (error) {
      internalServerErrorResponse(res, "Error al eliminar el director", error as any);
    }
  }


}