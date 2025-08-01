import prisma from '../../db/db.js';
import { Movie_Actor } from '@prisma/client';
import { CreateMovieActorDto, UpdateMovieActorDto } from './movie-actor.dtos.js';

export class MovieActorDAO {

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

    async create(movieActor: CreateMovieActorDto): Promise<Movie_Actor | null> {
        const result = await prisma.movie_Actor.create({
            data: { ...movieActor },
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
    
    async update(movieId: number, actorId: number, newMovieActor: UpdateMovieActorDto): Promise<Movie_Actor | null> {
        const result = await prisma.movie_Actor.update({
            where: {
                id_movie_id_actor: {
                    id_movie: movieId,
                    id_actor: actorId,
                },
            },
            data: {
                ...newMovieActor,
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
}
