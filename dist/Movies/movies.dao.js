import prisma from "../db/db.js";
export class MovieDAO {
    async getAll() {
        const movies = await prisma.movie.findMany();
        return movies;
    }
    // getById(id: number): Movie | undefined {
    //   return this.movies.find((movie) => movie.id === id);
    // }
    async add(movie) {
        await prisma.movie.add(movie);
        return movie;
    }
}
//# sourceMappingURL=movies.dao.js.map