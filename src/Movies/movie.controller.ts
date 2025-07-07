// Agregar validacion de parametros
import { Movie } from "@prisma/client";
import { MovieDAO } from "./movie.dao.js";
import { Request, Response } from "express";
import { z } from "zod";
import { CreateMovieDto, movieZodSchema } from "./movie.interface.js";
import { CategoryDAO } from "../Categories/category.dao.js";
import { DirectorDAO } from "../Directors/director.dao.js";
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse, zodErrorResponse } from "../utils/responseHandler.js";

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
        notFoundResponse(res, "Películas no encontradas");
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
      zodErrorResponse(res, "ID de película inválido", validation.error.errors);
    }

    try {
      const result = await this.dao.getById(id);

      if (!result) {
        notFoundResponse(res, "Película no encontrada");
      }
      successResponse(res, result, "Película obtenida con éxito", 200);
    } catch (error) {
      internalServerErrorResponse(res, "Error al obtener la película", error as any);
    }
  }

  async addMovie(req: Request, res: Response) {
    try {
      const movie: CreateMovieDto = req.body;

      const validation = movieZodSchema.safeParse(movie);

      if (!validation.success) {
        return res.status(400).json({
          error: "Datos de película inválidos",
          issues: validation.error.errors,
        });
      }
      const { id_category } = movie;
      const category = await this.daoCategory.getById(id_category);
      if (!category) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }

      const { id_director } = movie;
      const director = await this.daoDirector.getById(id_director);

      if (!director) {
        return res.status(404).json({ message: "Director no encontrado" });
      }

      const newMovie = await this.dao.add(movie);
      if (!newMovie) {
        return res.status(400).json({ message: "Error al crear la película" });
      }

      successResponse(res, newMovie, "Película creada con éxito", 201);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la película", error });
    }
  }

  async updateMovie(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const idSchema = z.coerce.number().int().positive();
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return res.status(400).send({ error: "ID de película inválido" });
    }

    const updatedData: Partial<CreateMovieDto> = req.body;
    const validationData = movieZodSchema.partial().safeParse(updatedData);
    if (!validationData.success) {
      return res.status(400).json({
        error: "Datos de película inválidos",
        issues: validationData.error.errors,
      });
    }

    try {
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res
          .status(400)
          .send({ error: "No se enviaron datos para actualizar" });
      }
      // valido que la categoría exista si se envió
      const { id_category } = updatedData;
      if (id_category) {
        const category = await this.daoCategory.getById(id_category);
        if (!category) {
          return res.status(404).json({ message: "Categoría no encontrada" });
        }
      }
      // valido que el director exista si se envió
      const { id_director } = updatedData;
      if (id_director) {
        const director = await this.daoDirector.getById(id_director);
        if (!director) {
          return res.status(404).json({ message: "Director no encontrado" });
        }
      }

      const existingMovie = await this.dao.getById(id);
      if (!existingMovie) {
        return res.status(404).send({ error: "Película no encontrada" });
      }

      const updatedMovie: Movie = { ...existingMovie, ...updatedData };
      const result: Movie | null = await this.dao.update(id, updatedMovie);
      if (!result) {
        return res
          .status(400)
          .send({ error: "Error al actualizar la película" });
      }
      successResponse(res, result, "Película obtenida con éxito", 204);
    } catch (error) {
      console.error("Error al actualizar la película:", error);
      res.status(500).send({ error: "Error al actualizar la película" });
    }
  }

  async deleteMovie(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const existingMovie = await this.dao.getById(id);
      if (!existingMovie) {
        return res.status(404).send({ error: "Película no encontrada" });
      }
      const result: Movie | null = await this.dao.delete(id);
      if (!result) {
        return res.status(400).send({ error: "Error al eliminar la película" });
      }
      successResponse(res, result, "Película eliminada con éxito", 204);
    } catch (error) {
      console.error("Error al eliminar la película:", error);
      res.status(500).send({ error: "Error al eliminar la película" });
    }
  }
}
