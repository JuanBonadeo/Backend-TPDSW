import prisma from "../db/db.js";
import { Movie } from "@prisma/client";
import { CreateMovieDto } from "./movie.interface.js";


export class MovieDAO {
  

  async getAll(): Promise<Movie[] | null>{
    const movies = await prisma.movie.findMany();
    return movies
  }
  
  async getById(id: number): Promise<Movie | null> {
    const movie = await prisma.movie.findUnique({
      where: { id_movie: id } 
    })
    return movie
  }

  async add(movie: CreateMovieDto): Promise<Movie | null>{
    const newMovie = await prisma.movie.create({
      data: {
        title_movie: movie.title_movie,
        duration: movie.duration,
        description: movie.description,
        rating: movie.rating
      }
    })
    return newMovie
  }

  async update(id: number, updatedMovie: Movie): Promise<Movie | null>  {
    const result = await prisma.movie.update({
      where: { id_movie: id },
      data: {
        title_movie: updatedMovie.title_movie,
        duration: updatedMovie.duration,
        description: updatedMovie.description,
        releaseDate: updatedMovie.releaseDate,
        rating: updatedMovie.rating
      }
    })
    return result
    
  }

  async delete(id: number): Promise< Movie > {
    const result = await prisma.movie.delete({
      where: {id_movie: id}
    })
    return result
  }
  
}