const DBProvisoria = [
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
    constructor() {
        this.movies = DBProvisoria;
    }
    getAll() {
        return this.movies;
    }
    getById(id) {
        return this.movies.find((movie) => movie.id === id);
    }
    add(movie) {
        this.movies.push(movie);
        return movie;
    }
    update(id, updatedMovie) {
        const index = this.movies.findIndex((movie) => movie.id === id);
        if (index !== -1) {
            this.movies[index] = updatedMovie;
        }
    }
    delete(id) {
        const index = this.movies.findIndex((movie) => movie.id === id);
        if (index !== -1) {
            this.movies.splice(index, 1);
        }
    }
}
//# sourceMappingURL=moviesDao.js.map