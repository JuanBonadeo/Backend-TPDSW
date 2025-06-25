// movie-actor.routes.ts (ejemplo de rutas)
import { Router } from "express";
import { Request, Response } from "express";
import { MovieActorController } from "./movie-actor.controller.js";

export const router = Router();
const controller = new MovieActorController();

router.post("/", (req: Request, res: Response) => {
  controller.assignActorToMovie(req, res);
});

// // GET /api/movie-actors/movie/:movieId - Obtener actores de una película
// router.get("/movie/:movieId", movieActorController.getActorsByMovie(movieActorController));

// // GET /api/movie-actors/actor/:actorId - Obtener películas de un actor
// router.get("/actor/:actorId", movieActorController.getMoviesByActor(movieActorController));

// // DELETE /api/movie-actors/movie/:movieId/actor/:actorId - Desasignar actor de película
// router.delete("/movie/:movieId/actor/:actorId", movieActorController.removeActorFromMovie(movieActorController));

// // PUT /api/movie-actors/movie/:movieId/actor/:actorId/role - Actualizar rol del actor
// router.put("/movie/:movieId/actor/:actorId/role", movieActorController.updateActorRole(movieActorController));

