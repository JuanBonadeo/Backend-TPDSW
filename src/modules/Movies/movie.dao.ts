import prisma from '../../db/db.js';
import { Movie } from '@prisma/client';
import { CreateMovieDto, MovieFilters, movieList, MovieQueryDto, UpdateMovieDto } from './movie.dtos.js';

export class MovieDAO {
    async getAll(): Promise<Movie[] | null> {
        const movies = await prisma.movie.findMany({
            where: { deleted_at: null },
            include: {
                Category: true,
                Director: true,
            },
        });
        return movies;
    }

    async getOne(id: number): Promise<Movie | null> {
        const movie = await prisma.movie.findUnique({
            where: { id_movie: id, deleted_at: null },
            include: {
                Category: true,
                Director: true,
                Movie_Actor: {
                    include: {
                        Actor: true,
                    },
                },
            },
        });
        return movie;
    }

    async create(movie: CreateMovieDto): Promise<Movie | null> {
        const newMovie = await prisma.movie.create({
            data: {
                title: movie.title,
                description: movie.description,
                duration: movie.duration,
                release_date: movie.release_date,
                rating: movie.rating,

                id_category: movie.id_category,
                id_director: movie.id_director,
            },
            include: {
                Category: true,
                Director: true,
            },
        });
        return newMovie;
    }

    async update(id: number, updatedMovie: UpdateMovieDto): Promise<Movie | null> {
        const result = await prisma.movie.update({
            where: { id_movie: id, deleted_at: null },
            data: {
                title: updatedMovie.title,
                description: updatedMovie.description,
                duration: updatedMovie.duration,
                release_date: updatedMovie.release_date,
                rating: updatedMovie.rating,
            },
        });
        return result;
    }

    async delete(id: number): Promise<Movie> {
        const result = await prisma.movie.update({
            where: { id_movie: id, deleted_at: null },
            data: { deleted_at: new Date() },
        });
        return result;
    }

    async listMovies(query: MovieQueryDto): Promise<movieList | null> {
        const where: any = {
            deleted_at: null,
            ...(query.title && { title: { contains: query.title, mode: 'insensitive' } }),
            ...(query.categoryId && { id_category: query.categoryId }),

        };

        const movies = await prisma.movie.findMany({
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            where,
        });
        const totalMovies = await prisma.movie.count({ where });

        return {
            currentPage: query.page,
            totalPages: Math.ceil(totalMovies / query.limit),
            total: totalMovies,
            movies,
        };
    }
}
