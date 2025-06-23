// Agregar validacion de parametros
import { Movie } from "@prisma/client";
import { MovieDAO } from "./movie.dao.js";
import { Request, Response } from "express";
// import { z } from "zod";
import { CreateMovieDto } from "./movie.interface.js";
import { CategoryDAO } from "../Categories/category.dao.js";


export class MovieController {
    private dao: MovieDAO;
    private daoCategory: CategoryDAO;

    constructor() {
        this.dao = new MovieDAO();
        this.daoCategory = new CategoryDAO();   //TODO: preguntar a meca si esto rompe con la arquitectura en capas
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

            if (!result) {
                res.status(404).send({ error: "Película no encontrada" });
            } else {
                res.send({ result });
            }
        } catch (error) {
            console.error("Error al obtener la película:", error);
            res.status(500).send({ error: "Error al obtener la película" });
        }
    }

    async addMovie(req: Request, res: Response) {
        try {
            const movie: CreateMovieDto = req.body
            if (!movie || !movie.title || !movie.id_category) {
                return res.status(400).json({ message: "Datos de película incompletos" });
            }
            // valido que exista la categoría
            const { id_category } = movie;
            const category = await this.daoCategory.getById(id_category);
            if (!category) {
                return res.status(404).json({ message: "Categoría no encontrada" });
            }
            const newMovie = await this.dao.add(movie);
            if (!newMovie) {
                return res.status(400).json({ message: "Error al crear la película" });
            }

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
            // valido que la categoría exista si se envió
            const { id_category } = updatedData;
            if (id_category) {
                const category = await this.daoCategory.getById(id_category);
                if (!category) {
                    return res.status(404).json({ message: "Categoría no encontrada" });
                }
            }
            const existingMovie = await this.dao.getById(id);
            if (!existingMovie) {
                return res.status(404).send({ error: "Película no encontrada" });
            }

            const updatedMovie: Movie = { ...existingMovie, ...updatedData };
            const result: Movie | null = await this.dao.update(id, updatedMovie);
            if (!result) {
                return res.status(400).send({ error: "Error al actualizar la película" });
            }
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
            const result: Movie | null = await this.dao.delete(id);
            if (!result) {
                return res.status(400).send({ error: "Error al eliminar la película" });
            }
            res.status(200).send({ message: `Película con id ${id} eliminada con éxito` });

        } catch (error) {
            console.error("Error al eliminar la película:", error);
            res.status(500).send({ error: "Error al eliminar la película" });
        }
    }
}
