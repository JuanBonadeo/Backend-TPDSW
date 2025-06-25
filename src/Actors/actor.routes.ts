import { Router } from "express";
import { Request, Response } from "express";
import { ActorController } from "./actor.controller.js";

export const router = Router();

const controller = new ActorController();

router.get("/", (req: Request, res: Response) => {
  controller.getAllActors(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  controller.getActorById(req, res);
});

router.post("/", (req: Request, res: Response) => {
  controller.addActor(req, res);
});

router.patch("/:id", (req: Request, res: Response) => {
  controller.updateActor(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
   controller.deleteActor(req, res); 
});