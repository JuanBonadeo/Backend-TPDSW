import prisma from "../db/db.js";
import { Movie } from "@prisma/client";
import { CreateMovieDto } from "./movie.interface.js";


export class MovieDAO {


    async getAll(): Promise<Movie[] | null> {
        const movies = await prisma.movie.findMany();
        return movies
    }

    async getById(id: number): Promise<Movie | null> {
        const movie = await prisma.movie.findUnique({
            where: { id_movie: id },
            include: {
                Category: true // Include the related category information
            }
        })
        return movie
    }

    async add(movie: CreateMovieDto): Promise<Movie | null> {
        const newMovie = await prisma.movie.create({
            data: {
                title: movie.title,
                duration: movie.duration,
                description: movie.description,
                release_date: movie.release_date,
                rating: movie.rating,
                id_category: movie.id_category
            },
            include: {
                Category: true // Include the related category information
            }
        })
        return newMovie
    }

    async update(id: number, updatedMovie: Movie): Promise<Movie | null> {
        const result = await prisma.movie.update({
            where: { id_movie: id },
            data: {
                title: updatedMovie.title,
                duration: updatedMovie.duration,
                description: updatedMovie.description,
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

}