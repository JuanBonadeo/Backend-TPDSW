import prisma from '../../db/db.js';
import { Movie_Actor, Actor } from '@prisma/client';
import { CreateMovieActorDto, Role } from './movie-actor.interface.js';

export class MovieActorDAO {
    async add(movieActor: CreateMovieActorDto): Promise<Movie_Actor | null> {
        const result = await prisma.movie_Actor.create({
            data: {
                id_movie: movieActor.id_movie,
                id_actor: movieActor.id_actor,
                role: movieActor.role,
            },
            include: {
                Movie: {
                    select: {
                        id_movie: true,
                        title: true,
                    },
                },
                Actor: {
                    select: {
                        id_actor: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        return result;
    }

    async getActorsByMovieId(movieId: number): Promise<Movie_Actor[] | null> {
        const result = await prisma.movie_Actor.findMany({
            where: { id_movie: movieId },
            include: {
                Actor: {
                    select: {
                        id_actor: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        return result;
    }

    async getMoviesByActorId(actorId: number): Promise<Movie_Actor[] | null> {
        const result = await prisma.movie_Actor.findMany({
            where: { id_actor: actorId },
            include: {
                Movie: {
                    select: {
                        id_movie: true,
                        title: true,
                    },
                },
            },
        });
        return result;
    }

    async delete(movieId: number, actorId: number): Promise<Movie_Actor | null> {
        const result = await prisma.movie_Actor.delete({
            where: {
                id_movie_id_actor: {
                    id_movie: movieId,
                    id_actor: actorId,
                },
            },
        });
        return result;
    }

    async updateRole(movieId: number, actorId: number, newRole: Role) {
        const result = await prisma.movie_Actor.update({
            where: {
                id_movie_id_actor: {
                    id_movie: movieId,
                    id_actor: actorId,
                },
            },
            data: {
                role: newRole,
            },
            include: {
                Movie: {
                    select: {
                        id_movie: true,
                        title: true,
                    },
                },
                Actor: {
                    select: {
                        id_actor: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        return result;
    }
}
