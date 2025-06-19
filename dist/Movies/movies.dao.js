import prisma from "../db/db.js";
export class MovieDAO {
    async getAll() {
        const movies = await prisma.movie.findMany();
        return movies;
    }
    async getById(id) {
        const movie = await prisma.movie.findUnique({
            where: { id_movie: id }
        });
        return movie;
    }
    async add(movie) {
        const newMovie = await prisma.movie.create({
            data: {
                title_movie: movie.title_movie,
                duration: movie.duration,
                description: movie.description,
                rating: movie.rating
            }
        });
        return newMovie;
    }
    async update(id, updatedMovie) {
        const result = await prisma.movie.update({
            where: { id_movie: id },
            data: {
                title_movie: updatedMovie.title_movie,
                duration: updatedMovie.duration,
                description: updatedMovie.description,
                releaseDate: updatedMovie.releaseDate,
                rating: updatedMovie.rating
            }
        });
        return result;
    }
    async delete(id) {
        const result = await prisma.movie.delete({
            where: { id_movie: id }
        });
        return result;
    }
}
//# sourceMappingURL=movies.dao.js.map