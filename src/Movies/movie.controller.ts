// Agregar validacion de parametros
import { Movie } from "@prisma/client";
import { MovieDAO } from "./movie.dao.js";
import { Request, Response } from "express";
import { z } from "zod";
import { CreateMovieDto, movieZodSchema } from "./movie.interface.js";
import { CategoryDAO } from "../Categories/category.dao.js";
import { DirectorDAO } from "../Directors/director.dao.js";
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse, zodErrorResponse } from "../utils/responseHandler.js";
import { error } from "console";

export class MovieController {
  private dao: MovieDAO;
  private daoCategory: CategoryDAO;
  private daoDirector: DirectorDAO;

  constructor() {
    this.dao = new MovieDAO();
    this.daoCategory = new CategoryDAO(); //TODO: preguntar a meca si esto rompe con la arquitectura en capas
    this.daoDirector = new DirectorDAO();
  }


  async getAllMovies(req: Request, res: Response) {
    try {
      const result = await this.dao.getAll();

      if (!result || result.length === 0) {
        return notFoundResponse(res, "Películas no encontradas");
      }
      successResponse(res, result, "Películas obtenidas con éxito", 200);
    } catch (error) {
      internalServerErrorResponse(res, "Error al obtener las películas", error as any);
    }
  }


  async getMovieById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    const idSchema = z.coerce.number().int().positive();
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return zodErrorResponse(res, "ID de película inválido", validation.error.errors);
    }

    try {
      const result = await this.dao.getById(id);

      if (!result) {
        return notFoundResponse(res, "Película no encontrada");
      }
      successResponse(res, result, "Película obtenida con éxito", 200);
    } catch (error) {
      internalServerErrorResponse(res, "Error al obtener la película", error as any);
      
    }
  }


  async addMovie(req: Request, res: Response) {
    const movie: CreateMovieDto = req.body;
    const validation = movieZodSchema.safeParse(movie);
    if (!validation.success) {
      return zodErrorResponse(res, "Datos de película inválidos", validation.error.errors);
    }
    const { id_category, id_director } = movie;

    try {
      const category = await this.daoCategory.getById(id_category);
      if (!category) {
        return notFoundResponse(res, "Categoría no encontrada");
      }

      const director = await this.daoDirector.getById(id_director);

      if (!director) {
        return notFoundResponse(res, "Director no encontrado");
      }

      const newMovie = await this.dao.add(movie);
      if (!newMovie) {
        return errorResponse(res, "Error al crear la película");
      }

      successResponse(res, newMovie, "Película creada con éxito", 201);
    } catch (error) {
      internalServerErrorResponse(res, "Error al crear la película", error as any);
    }
  }


  async updateMovie(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const updatedData: Partial<CreateMovieDto> = req.body;
    const movieData = { id: id, ...updatedData} as CreateMovieDto;

    const validationData = movieZodSchema.partial().safeParse(movieData);
    if (!validationData.success) {
      return zodErrorResponse(res, "Datos de película inválidos", validationData.error.errors);
    }
    
    const { id_category, id_director } = updatedData;
    try {
      if (id_category) {
        const category = await this.daoCategory.getById(id_category);
        if (!category) {
            return notFoundResponse(res, "Categoría no encontrada");
        }
      }

      if (id_director) {
        const director = await this.daoDirector.getById(id_director);
        if (!director) {
          return notFoundResponse(res, "Director no encontrado");
        }
      }

      const existingMovie = await this.dao.getById(id);
      if (!existingMovie) {
        return notFoundResponse(res, "Película no encontrada");
      }

      const updatedMovie: Movie = { ...existingMovie, ...updatedData } as Movie;
      const result: Movie | null = await this.dao.update(id, updatedMovie);
      if (!result) {
        return errorResponse(res, "Error al actualizar la película");
        
      }
      successResponse(res, result, "Película obtenida con éxito", 204);
    } catch (error) {
      internalServerErrorResponse(res, "Error al actualizar la película", error as any);
    }
  }

  
  async deleteMovie(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const idSchema = z.coerce.number().int().positive();
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return zodErrorResponse(res, "ID de película inválido", validation.error.errors);
    }
    
    try {
      const existingMovie = await this.dao.getById(id);
      if (!existingMovie) {
        return notFoundResponse(res, "Película no encontrada");
      }
      const result: Movie | null = await this.dao.delete(id);
      if (!result) {
        return errorResponse(res, "Error al eliminar la película");
      }
      successResponse(res, result, "Película eliminada con éxito", 204);
    } catch (error) {
      internalServerErrorResponse(res, "Error al eliminar la película", error as any);
    }
  }

  async listMovies(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const take = parseInt(req.query.take as string) || 12;
    const categoryId = parseInt(req.query.categoryId as string) || 0;
    const directorId = parseInt(req.query.directorId as string) || 0;
    const actorId = parseInt(req.query.actorId as string) || 0;
    const filters = { categoryId, directorId, actorId };
    try {
      const result = await this.dao.listMovies(page, take, filters);
      if (!result) {
        return notFoundResponse(res, "Películas no encontradas");
      }
      successResponse(res, result, "Películas obtenidas con éxito", 200);
    } catch (error) {
      internalServerErrorResponse(res, "Error al obtener las películas", error as any);
    }
  }
}

