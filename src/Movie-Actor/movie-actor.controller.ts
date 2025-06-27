
import { Request, Response } from "express";
import { MovieActorDAO } from "./movie-actor.dao.js";
import { CreateMovieActorDto } from "./movie-actor.interface.js";
import { MovieDAO } from "../Movies/movie.dao.js";
import { ActorDAO } from "../Actors/actor.dao.js";
import { Role } from './movie-actor.interface';

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

            // TODO: CAPA SERVICIOS???
            const movie = await this.movieDao.getById(movieActorData.id_movie);
            if (!movie) {
                return res.status(404).json({ message: "Película no encontrada" });
            }

            const actor = await this.actorDao.getById(movieActorData.id_actor);
            if (!actor) {
                return res.status(404).json({ message: "Actor no encontrado" });
            }

            const result = await this.dao.add(movieActorData);
            
            if (result) {
                res.status(201).json({ 
                    message: "Actor asignado a la película exitosamente",
                    data: movieActorData
                });
            } else {
                res.status(400).json({ message: "Error al asignar el actor a la película" });
            }

        } catch (error) {
            console.error("Error al asignar actor a película:", error);
            res.status(500).json({ 
                message: "Error interno del servidor", 
                error: error instanceof Error ? error.message : error 
            });
        }
    }

    
    async getActorsByMovie(req: Request, res: Response) {
        try {
            const movieId = parseInt(req.params.movieId);

            // Verificar que la película existe
            const movie = await this.movieDao.getById(movieId);
            if (!movie) {
                return res.status(404).json({ message: "Película no encontrada" });
            }

            const actors = await this.dao.getActorsByMovieId(movieId);
            
            res.status(200).json({
                movie: movie.title,
                actors: actors
            });

        } catch (error) {
            console.error("Error al obtener actores de la película:", error);
            res.status(500).json({ 
                message: "Error al obtener actores de la película", 
                error: error instanceof Error ? error.message : error 
            });
        }
    }


    async getMoviesByActor(req: Request, res: Response) {
        try {
            const actorId = parseInt(req.params.actorId);

            const actor = await this.actorDao.getById(actorId);
            if (!actor) {
                return res.status(404).json({ message: "Actor no encontrado" });
            }

            const movies = await this.dao.getMoviesByActorId(actorId);
            
            res.status(200).json({
                actor: `${actor.first_name} ${actor.last_name}`,
                movies: movies
            });

        } catch (error) {
            console.error("Error al obtener películas del actor:", error);
            res.status(500).json({ 
                message: "Error al obtener películas del actor", 
                error: error instanceof Error ? error.message : error 
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const movieId = parseInt(req.params.movieId);
            const actorId = parseInt(req.params.actorId);

            const result = await this.dao.delete(movieId, actorId);
            
            if (result) {
                res.status(200).json({ 
                    message: "Actor removido de la película exitosamente" 
                });
            } else {
                res.status(400).json({ 
                    message: "Error al remover el actor de la película" 
                });
            }

        } catch (error) {
            console.error("Error al remover actor de película:", error);
            res.status(500).json({ 
                message: "Error interno del servidor", 
                error: error instanceof Error ? error.message : error 
            });
        }
    }

    async updateActorRole(req: Request, res: Response) {
        try {
            const movieId = parseInt(req.body.id_movie);
            const actorId = parseInt(req.body.id_actor);
            const role: Role = req.body?.role;
            
            const result = await this.dao.updateRole(movieId, actorId, role);
            
            if (result) {
                res.status(200).json({ 
                    message: "Rol del actor actualizado exitosamente",
                    data: { movieId, actorId, role }
                });
            } else {
                res.status(400).json({ 
                    message: "Error al actualizar el rol del actor" 
                });
            }

        } catch (error) {
            console.error("Error al actualizar rol del actor:", error);
            res.status(500).json({ 
                message: "Error interno del servidor", 
                error: error instanceof Error ? error.message : error 
            });
        }
    }
}