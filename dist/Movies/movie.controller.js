import { MovieDAO } from "./movies.dao.js";
export class MovieController {
    constructor() {
        this.dao = new MovieDAO();
    }
    async getAllMovies(req, res) {
        try {
            const result = await this.dao.getAll();
            if (!result || result.length === 0) {
                return res.status(404).send({ error: "No se encontraron peliculas" });
            }
            res.send({ result });
        }
        catch (error) {
            console.error("Error al obtener las películas:", error);
            res.status(500).send({ error: "Error al obtener las películas" });
        }
    }
}
//# sourceMappingURL=movie.controller.js.map