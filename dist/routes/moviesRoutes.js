import { Router } from "express";
import { MovieController } from "../controllers/movieController.js";
export const router = Router();
const controller = new MovieController();
router.get("/", (req, res) => {
    controller.getMovies(req, res);
});
router.get("/:id", (req, res) => {
    controller.getMovieById(req, res);
});
router.post("/", (req, res) => {
    controller.addMovie(req, res);
});
router.put("/:id", (req, res) => {
    controller.updateMovie(req, res);
});
router.delete("/:id", (req, res) => {
    controller.deleteMovie(req, res);
});
//# sourceMappingURL=moviesRoutes.js.map