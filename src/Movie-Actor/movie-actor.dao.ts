

import { Movie_Actor } from '@prisma/client';
import { CreateMovieActorDto } from './movie-actor.interface.js';
import prisma from '../db/db.js';

export class MovieActorDAO {

    async add(movieActor: CreateMovieActorDto): Promise<Movie_Actor | null>{
        try {
            const result = await prisma.movie_Actor.create({
                data: { 
                    id_movie: movieActor.id_movie,
                    id_actor: movieActor.id_actor,
                    role: movieActor.role
                },
                include: {
                    Movie: {
                        select: {
                            id_movie: true,
                            title: true
                        }
                    },
                    // TODO: Ver como incluir Actor       
                }
            });
            return result;
        } catch (error) {
            console.error("Error al crear Movie_Actor:", error);
            throw error;
        }
    }

    // async getByMovieId(movieId: number) {
    //     try {
    //         const result = await this.prisma.$queryRaw`
    //             SELECT 
    //                 ma.id_movie,
    //                 ma.id_actor,
    //                 ma.role,
    //                 ma.created_at,
    //                 a.first_name,
    //                 a.last_name,
    //                 a.birth_date
    //             FROM "Movie_Actor" ma
    //             INNER JOIN "Actor" a ON ma.id_actor = a.id_actor
    //             WHERE ma.id_movie = ${movieId}
    //             ORDER BY ma.created_at DESC
    //         `;
    //         return result;
    //     } catch (error) {
    //         console.error("Error al obtener actores de la película:", error);
    //         throw error;
    //     }
    // }

    // async getByActorId(actorId: number) {
    //     try {
    //         const result = await this.prisma.$queryRaw`
    //             SELECT 
    //                 ma.id_movie,
    //                 ma.id_actor,
    //                 ma.role,
    //                 ma.created_at,
    //                 m.title,
    //                 m.release_date
    //             FROM "Movie_Actor" ma
    //             INNER JOIN "Movie" m ON ma.id_movie = m.id_movie
    //             WHERE ma.id_actor = ${actorId}
    //             ORDER BY ma.created_at DESC
    //         `;
    //         return result;
    //     } catch (error) {
    //         console.error("Error al obtener películas del actor:", error);
    //         throw error;
    //     }
    // }

    // async exists(movieId: number, actorId: number): Promise<boolean> {
    //     try {
    //         const result = await this.prisma.$queryRaw`
    //             SELECT COUNT(*) as count
    //             FROM "Movie_Actor"
    //             WHERE id_movie = ${movieId} AND id_actor = ${actorId}
    //         ` as any[];
            
    //         return parseInt(result[0].count) > 0;
    //     } catch (error) {
    //         console.error("Error al verificar existencia de Movie_Actor:", error);
    //         throw error;
    //     }
    // }

    // async delete(movieId: number, actorId: number) {
    //     try {
    //         const result = await this.prisma.$executeRaw`
    //             DELETE FROM "Movie_Actor"
    //             WHERE id_movie = ${movieId} AND id_actor = ${actorId}
    //         `;
    //         return result;
    //     } catch (error) {
    //         console.error("Error al eliminar Movie_Actor:", error);
    //         throw error;
    //     }
    // }

    // async updateRole(movieId: number, actorId: number, newRole: string) {
    //     try {
    //         const result = await this.prisma.$executeRaw`
    //             UPDATE "Movie_Actor"
    //             SET role = ${newRole}
    //             WHERE id_movie = ${movieId} AND id_actor = ${actorId}
    //         `;
    //         return result;
    //     } catch (error) {
    //         console.error("Error al actualizar rol del actor:", error);
    //         throw error;
    //     }
    // }
}