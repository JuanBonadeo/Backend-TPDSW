
import { Request, Response } from "express";
import { MovieActorDAO } from "./movie-actor.dao.js";
import { CreateMovieActorDto, movieActorZodSchema } from "./movie-actor.interface.js";
import { MovieDAO } from "../Movies/movie.dao.js";
import { ActorDAO } from "../Actors/actor.dao.js";
import { Role } from './movie-actor.interface';
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse, zodErrorResponse } from "../utils/responseHandler.js";
import z from "zod";

export class MovieActorController {
    private dao: MovieActorDAO;
    private movieDao: MovieDAO;
    private actorDao: ActorDAO;

    constructor() {
        this.dao = new MovieActorDAO();
        this.movieDao = new MovieDAO();
        this.actorDao = new ActorDAO();
    }


    async assignActorToMovie(req: Request, res: Response) {
        try {
            const movieActorData: CreateMovieActorDto = req.body;
            const validation = movieActorZodSchema.safeParse(movieActorData);
            if (!validation.success) {
                zodErrorResponse(res, "Error de validación", validation.error.issues);
                return;
            }

            const movie = await this.movieDao.getById(movieActorData.id_movie);
            if (!movie) {
                notFoundResponse(res, "Película no encontrada");
                return;
            }

            const actor = await this.actorDao.getById(movieActorData.id_actor);
            if (!actor) {
                notFoundResponse(res, "Actor no encontrado");
                return;
            }

            const result = await this.dao.add(movieActorData);
            if (!result) {
                errorResponse(res, "Error al asignar actor a la película", null, 400);
                return;
            }
            successResponse(res, result, "Actor asignado a la película exitosamente");


        } catch (error) {
            internalServerErrorResponse(res, "Error interno del servidor", error as any);
        }
    }


    async getActorsByMovie(req: Request, res: Response) {
        try {
            const movieId = parseInt(req.params.movieId);

            const movieIdSchema = z.coerce.number().int().positive("ID de película inválido");
            const validation = movieIdSchema.safeParse(movieId);
            if (!validation.success) {
                zodErrorResponse(res, "ID de película inválido", validation.error.errors);
                return;
            }

            const movie = await this.movieDao.getById(movieId);
            if (!movie) {
                notFoundResponse(res, "Película no encontrada");
                return
            }

            const actors = await this.dao.getActorsByMovieId(movieId);

            if (!actors || actors.length === 0) {
                notFoundResponse(res, "No se encontraron actores para esta película");
                return;
            }
            successResponse(res, { movie: movie.title, actors: actors }, "Actores obtenidos exitosamente");

        } catch (error) {
            internalServerErrorResponse(res, "Error al obtener actores de la película", error as any);
        }
    }


    async getMoviesByActor(req: Request, res: Response) {
        try {
            const actorId = parseInt(req.params.actorId);
            const actorIdSchema = z.coerce.number().int().positive("ID de actor inválido");
            const validation = actorIdSchema.safeParse(actorId);
            if (!validation.success) {
                zodErrorResponse(res, "ID de actor inválido", validation.error.errors);
                return;
            }
            const actor = await this.actorDao.getById(actorId);
            if (!actor) {
                notFoundResponse(res, "Actor no encontrado");
                return;
            }

            const movies = await this.dao.getMoviesByActorId(actorId);
            if (!movies || movies.length === 0) {
                notFoundResponse(res, "No se encontraron películas para este actor");
                return;
            }

            successResponse(res, { actor: actor.last_name , movies: movies }, "Películas del actor obtenidas exitosamente");
        } catch (error) {
            internalServerErrorResponse(res, "Error al obtener películas del actor", error as any);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const movieId = parseInt(req.params.movieId);
            const actorId = parseInt(req.params.actorId);
            const movieIdSchema = z.coerce.number().int().positive("ID de película inválido");
            const actorIdSchema = z.coerce.number().int().positive("ID de actor inválido");
            const movieValidation = movieIdSchema.safeParse(movieId);
            const actorValidation = actorIdSchema.safeParse(actorId);

            if (!movieValidation.success) {
                zodErrorResponse(res, "ID Pelicula inválido", movieValidation.error.errors, 400);
                return;
            }
            if (!actorValidation.success) {
                zodErrorResponse(res, "ID Actor inválido", actorValidation.error.errors, 400);
                return;
            }

            const result = await this.dao.delete(movieId, actorId);
            !result && errorResponse(res, "Error al eliminar actor de la película", null, 400);

            successResponse(res, { movieId, actorId }, "Actor removido de la película exitosamente");
        } catch (error) {
            internalServerErrorResponse(res, "Error interno del servidor", error as any);
        }
    }

    async updateActorRole(req: Request, res: Response) {
        try {
            const movieId = parseInt(req.body.id_movie);
            const actorId = parseInt(req.body.id_actor);
            const role: Role = req.body?.role;

            const data = { id_movie: movieId, id_actor: actorId, role };
            const validation = movieActorZodSchema.safeParse(data);
            if (!validation.success) {
                zodErrorResponse(res, "Error de validación", validation.error.issues);
                return;
            }

            const result = await this.dao.updateRole(movieId, actorId, role);

            if (!result) {
                errorResponse(res, "Error al actualizar rol del actor", null, 400);
                return;
            }
            successResponse(res, result, "Rol del actor actualizado exitosamente");
        } catch (error) {
            internalServerErrorResponse(res, "Error interno del servidor", error as any);
        }
    }
}