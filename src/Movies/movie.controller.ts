// Agregar validacion de parametros
import { Movie } from "@prisma/client";
import { MovieDAO } from "./movies.dao.js";
import { Request, Response } from "express";
import { z } from "zod";
import { CreateMovieDto } from "./movie.interface.js";

export class MovieController {
  private dao: MovieDAO;

  constructor() {
    this.dao = new MovieDAO();
  }

  async getAllMovies(req: Request, res: Response) {
    try {
      const result = await this.dao.getAll();
      if (!result || result.length === 0) {
        return res.status(404).send({ error: "No se encontraron peliculas" });
      }
      res.send({ result });
    } catch (error) {
      console.error("Error al obtener las películas:", error);
      res.status(500).send({ error: "Error al obtener las películas" });
    }
  }

  async getMovieById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const result = await this.dao.getById(id);

      if (result) {
        res.send({ result });
      } else {
        res.status(404).send({ error: "Película no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener la película:", error);
      res.status(500).send({ error: "Error al obtener la película" });
    }
  }

  async addMovie(req: Request, res: Response) {
    // const movieSchema = z.object({
    //   title_movie: z.string().min(1, "El título es obligatorio"),
    //   duration: z.number().int().positive().optional(),
    //   description: z.string().optional(),
    //   releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    //     message: "Fecha de lanzamiento inválida",
    //   }).optional(),
    //   rating: z.number().min(0).max(10).optional(),
    // });
    try {
      // const parseResult = movieSchema.safeParse(req.body);

      // if (!parseResult.success) {
      //   return res.status(400).json({
      //     message: "Datos inválidos",
      //     errors: parseResult.error.format(),
      //   });
      // }

      // const movie = parseResult.data;

      const movie: CreateMovieDto = req.body
      const newMovie = await this.dao.add(movie);

      res.status(201).json(newMovie);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la película", error });
    }
  }

  async updateMovie(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const updatedData: Partial<CreateMovieDto> = req.body;

    try {
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res
          .status(400)
          .send({ error: "No se enviaron datos para actualizar" });
      }

      const existingMovie = await this.dao.getById(id);
      if (!existingMovie) {
        return res.status(404).send({ error: "Película no encontrada" });
      }

      const updatedMovie: Movie = { ...existingMovie, ...updatedData };
      const result: Movie | null = await this.dao.update(id, updatedMovie);

      res.status(200).send({ result });
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
      await this.dao.delete(id);
      res.status(200).send({ message: `Película con id ${id} eliminada con éxito` });

    } catch (error) {
      console.error("Error al eliminar la película:", error);}

    }
}
