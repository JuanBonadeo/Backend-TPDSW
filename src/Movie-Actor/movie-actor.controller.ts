
// movie-actor.controller.ts
import { Request, Response } from "express";
import { MovieActorDAO } from "./movie-actor.dao.js";
import { CreateMovieActorDto } from "./movie-actor.interface.js";
import { MovieDAO } from "../Movies/movie.dao.js";
import { ActorDAO } from "../Actors/actor.dao.js";

export class MovieActorController {
    private dao: MovieActorDAO;
    private movieDao: MovieDAO;
    private actorDao: ActorDAO;

    constructor() {
        this.dao = new MovieActorDAO();
        this.movieDao = new MovieDAO();
        this.actorDao = new ActorDAO();
    }
 
    // Asignar un actor a una película
    async assignActorToMovie(req: Request, res: Response) {
        try {
            const movieActorData: CreateMovieActorDto = req.body;
            
            if (!movieActorData.id_movie || !movieActorData.id_actor || !movieActorData.role) {
                return res.status(400).json({ 
                    message: "Se requieren id_movie, id_actor y role" 
                });
            }


            // TODO: CAPA SERVICIOS???
            const movie = await this.movieDao.getById(movieActorData.id_movie);
            if (!movie) {
                return res.status(404).json({ message: "Película no encontrada" });
            }

            const actor = await this.actorDao.getById(movieActorData.id_actor);
            if (!actor) {
                return res.status(404).json({ message: "Actor no encontrado" });
            }

            // const exists = await this.dao.exists(movieActorData.id_movie, movieActorData.id_actor);
            // if (exists) {
            //     return res.status(409).json({ 
            //         message: "El actor ya está asignado a esta película" 
            //     });
            // }

            // Asignar el actor a la película
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

    // // Obtener todos los actores de una película
    // async getActorsByMovie(req: Request, res: Response) {
    //     try {
    //         const movieId = parseInt(req.params.movieId);
            
    //         if (isNaN(movieId)) {
    //             return res.status(400).json({ message: "ID de película inválido" });
    //         }

    //         // Verificar que la película existe
    //         const movie = await this.movieDao.getById(movieId);
    //         if (!movie) {
    //             return res.status(404).json({ message: "Película no encontrada" });
    //         }

    //         const actors = await this.dao.getByMovieId(movieId);
            
    //         res.status(200).json({
    //             movie: movie.title,
    //             actors: actors
    //         });

    //     } catch (error) {
    //         console.error("Error al obtener actores de la película:", error);
    //         res.status(500).json({ 
    //             message: "Error al obtener actores de la película", 
    //             error: error instanceof Error ? error.message : error 
    //         });
    //     }
    // }

    // // Obtener todas las películas de un actor
    // async getMoviesByActor(req: Request, res: Response) {
    //     try {
    //         const actorId = parseInt(req.params.actorId);
            
    //         if (isNaN(actorId)) {
    //             return res.status(400).json({ message: "ID de actor inválido" });
    //         }

    //         // Verificar que el actor existe
    //         const actor = await this.actorDao.getById(actorId);
    //         if (!actor) {
    //             return res.status(404).json({ message: "Actor no encontrado" });
    //         }

    //         const movies = await this.dao.getByActorId(actorId);
            
    //         res.status(200).json({
    //             actor: `${actor.first_name} ${actor.last_name}`,
    //             movies: movies
    //         });

    //     } catch (error) {
    //         console.error("Error al obtener películas del actor:", error);
    //         res.status(500).json({ 
    //             message: "Error al obtener películas del actor", 
    //             error: error instanceof Error ? error.message : error 
    //         });
    //     }
    // }

    // // Desasignar un actor de una película
    // async removeActorFromMovie(req: Request, res: Response) {
    //     try {
    //         const movieId = parseInt(req.params.movieId);
    //         const actorId = parseInt(req.params.actorId);

    //         if (isNaN(movieId) || isNaN(actorId)) {
    //             return res.status(400).json({ 
    //                 message: "IDs de película y actor deben ser números válidos" 
    //             });
    //         }

    //         // Verificar que la relación existe
    //         const exists = await this.dao.exists(movieId, actorId);
    //         if (!exists) {
    //             return res.status(404).json({ 
    //                 message: "La relación entre actor y película no existe" 
    //             });
    //         }

    //         const result = await this.dao.delete(movieId, actorId);
            
    //         if (result) {
    //             res.status(200).json({ 
    //                 message: "Actor removido de la película exitosamente" 
    //             });
    //         } else {
    //             res.status(400).json({ 
    //                 message: "Error al remover el actor de la película" 
    //             });
    //         }

    //     } catch (error) {
    //         console.error("Error al remover actor de película:", error);
    //         res.status(500).json({ 
    //             message: "Error interno del servidor", 
    //             error: error instanceof Error ? error.message : error 
    //         });
    //     }
    // }

    // // Actualizar el rol de un actor en una película
    // async updateActorRole(req: Request, res: Response) {
    //     try {
    //         const movieId = parseInt(req.params.movieId);
    //         const actorId = parseInt(req.params.actorId);
    //         const { role } = req.body;

    //         if (isNaN(movieId) || isNaN(actorId)) {
    //             return res.status(400).json({ 
    //                 message: "IDs de película y actor deben ser números válidos" 
    //             });
    //         }

    //         if (!role || typeof role !== 'string') {
    //             return res.status(400).json({ 
    //                 message: "El rol es requerido y debe ser una cadena de texto" 
    //             });
    //         }

    //         // Verificar que la relación existe
    //         const exists = await this.dao.exists(movieId, actorId);
    //         if (!exists) {
    //             return res.status(404).json({ 
    //                 message: "La relación entre actor y película no existe" 
    //             });
    //         }

    //         const result = await this.dao.updateRole(movieId, actorId, role);
            
    //         if (result) {
    //             res.status(200).json({ 
    //                 message: "Rol del actor actualizado exitosamente",
    //                 data: { movieId, actorId, role }
    //             });
    //         } else {
    //             res.status(400).json({ 
    //                 message: "Error al actualizar el rol del actor" 
    //             });
    //         }

    //     } catch (error) {
    //         console.error("Error al actualizar rol del actor:", error);
    //         res.status(500).json({ 
    //             message: "Error interno del servidor", 
    //             error: error instanceof Error ? error.message : error 
    //         });
    //     }
    // }
}