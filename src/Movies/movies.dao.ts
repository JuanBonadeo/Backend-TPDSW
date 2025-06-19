import prisma from "../db/db.js";
import { Movie } from "@prisma/client";


export class MovieDAO {
  

  async getAll(): Promise<Movie[] | null>{
    const movies = await prisma.movie.findMany();
    return movies
  }
  
  // getById(id: number): Movie | undefined {
  //   return this.movies.find((movie) => movie.id === id);
  // }

  // async add(movie: Movie): Movie {
  //   await prisma.movie.add(movie)
  //   return movie;
  // }

  // update(id: number, updatedMovie: Movie): Movie {
  //   const index = this.movies.findIndex((movie) => movie.id === id);
  //   if (index !== -1) {
  //     this.movies[index] = updatedMovie;
  //   }
  //   return updatedMovie
  // }

  // delete(id: number): void {
  //   const index = this.movies.findIndex((movie) => movie.id === id);
  //   if (index !== -1) {
  //     this.movies.splice(index, 1);
  //   }
  // }
  
}