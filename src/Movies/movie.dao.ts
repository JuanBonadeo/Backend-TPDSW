import prisma from "../db/db.js";
import { Movie } from "@prisma/client";
import { CreateMovieDto, MovieFilters, movieList } from "./movie.interface.js";


export class MovieDAO {


    async getAll(): Promise<Movie[] | null> {
        const movies = await prisma.movie.findMany({ include: {
            Category: true,
            Director: true
        }});
        return movies
    }

    async getById(id: number): Promise<Movie | null> {
        const movie = await prisma.movie.findUnique({
            where: { id_movie: id },
            include: {
                Category: true,// Include the related category information
                Director: true // Include the related director information
            }
        })
        return movie
    }

    async add(movie: CreateMovieDto): Promise<Movie | null> {
        const newMovie = await prisma.movie.create({
            data: {
                title: movie.title,
                description: movie.description,
                duration: movie.duration,
                release_date: movie.release_date,
                rating: movie.rating,

                id_category: movie.id_category,
                id_director: movie.id_director
            },
            include: {
                Category: true,
                Director: true
            }
        })
        return newMovie
    }

    async update(id: number, updatedMovie: Movie): Promise<Movie | null> {
        const result = await prisma.movie.update({
            where: { id_movie: id },
            data: {
                title: updatedMovie.title,
                description: updatedMovie.description,
                duration: updatedMovie.duration,
                release_date: updatedMovie.release_date,
                rating: updatedMovie.rating
            }
        })
        return result

    }

    async delete(id: number): Promise<Movie> {
        const result = await prisma.movie.delete({
            where: { id_movie: id }
        })
        return result
    }


    async listMovies(page: number = 1,take: number = 12, filters: MovieFilters = {} ): Promise<movieList | null> {
    const where: any = {
        ...(filters.categoryId && { id_category: filters.categoryId }),
        ...(filters.directorId && { id_director: filters.directorId }),
        ...(filters.actorId && { actors: { some: { id_actor: filters.actorId } } }) 
    };

    const movies = await prisma.movie.findMany({ skip: (page - 1) * take, take, where });
    const totalMovies = await prisma.movie.count({ where });

    return {
        currentPage: page,
        totalPages: Math.ceil(totalMovies / take),
        movies
    };
    }

}