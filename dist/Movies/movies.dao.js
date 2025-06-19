import prisma from "../db/db.js";
export class MovieDAO {
    async getAll() {
        const movies = await prisma.movie.findMany();
        return movies;
    }
}
//# sourceMappingURL=movies.dao.js.map