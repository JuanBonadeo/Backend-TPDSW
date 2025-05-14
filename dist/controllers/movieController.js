import { MovieDAO } from "../Dao/moviesDao.js";
export class MovieController {
    constructor() {
        this.dao = new MovieDAO();
    }
    getMovies(req, res) {
        try {
            const result = this.dao.getAll();
            res.send({ result });
        }
        catch (error) {
            console.error("Error al obtener las películas:", error);
            res.status(500).send({ error: "Error al obtener las películas" });
        }
    }
    getMovieById(req, res) {
        const id = parseInt(req.params.id);
        try {
            const result = this.dao.getById(id);
            if (result) {
                res.send({ result });
            }
            else {
                res.status(404).send({ error: "Película no encontrada" });
            }
        }
        catch (error) {
            console.error("Error al obtener la película:", error);
            res.status(500).send({ error: "Error al obtener la película" });
        }
    }
    addMovie(req, res) {
        const movie = req.body;
        try {
            // Validar que el objeto movie tenga las propiedades necesarias
            if (!movie || !movie.title) {
                return res.status(400).send({ error: "Faltan datos de la película" });
            }
            // Validar que el id no exista
            const existingMovie = this.dao.getById(movie.id);
            if (existingMovie) {
                return res.status(400).send({ error: "La película ya existe" });
            }
            const result = this.dao.add(movie);
            res.status(201).send({ result });
        }
        catch (error) {
            console.error("Error al agregar la película:", error);
            res.status(500).send({ error: "Error al agregar la película" });
        }
    }
}
//# sourceMappingURL=movieController.js.map