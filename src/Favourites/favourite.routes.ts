import { Router } from "express";
import { Request, Response } from "express";
import { successResponse } from "../utils/responseHandler";
import { FavouriteController } from "./favourite.controller.js";

export const router = Router();
const controller = new FavouriteController();

router.post("/", async (req: Request, res: Response) => {
    controller.createFavourite(req, res)
});

router.get("/:id_user", async (req: Request, res: Response) => {
    controller.getFavouritesByUserId(req, res)
});

router.delete("/", async (req: Request, res: Response) => {
    controller.delete(req, res)
});
