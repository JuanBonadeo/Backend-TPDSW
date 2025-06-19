import { Router } from "express";
import { MovieController } from "./movie.controller.js";
export const router = Router();
const controller = new MovieController();
router.get("/", (req, res) => {
    controller.getAllMovies(req, res);
});
router.get("/:id", (req, res) => {
    controller.getMovieById(req, res);
});
router.post("/", (req, res) => {
    controller.addMovie(req, res);
});
router.patch("/:id", (req, res) => {
    controller.updateMovie(req, res);
});
router.delete("/:id", (req, res) => {
    controller.deleteMovie(req, res);
});
//# sourceMappingURL=movies.routes.js.map