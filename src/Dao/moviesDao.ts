import { Movie } from "../clases/Movie.js";

const DBProvisoria: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
  },
  {
    id: 2,
    title: "The Godfather",
  },
  {
    id: 3,
    title: "The Dark Knight",
  },
  {
    id: 4,
    title: "Pulp Fiction",
  },
  {
    id: 5,
    title: "Forrest Gump",
  },
];
export class MovieDAO {
  private movies: Movie[] = DBProvisoria;

  getAll(): Movie[] {
    return this.movies;
  }

  getById(id: number): Movie | undefined {
    return this.movies.find((movie) => movie.id === id);
  }

  add(movie: Movie): Movie {
    this.movies.push(movie);
    return movie;
  }

  update(id: number, updatedMovie: Movie): Movie {
    const index = this.movies.findIndex((movie) => movie.id === id);
    if (index !== -1) {
      this.movies[index] = updatedMovie;
    }
    return updatedMovie
  }

  delete(id: number): void {
    const index = this.movies.findIndex((movie) => movie.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
    }
  }
  
}