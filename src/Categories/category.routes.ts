import { Router } from "express";
import { Request, Response } from "express";
import { CategoryController } from "./category.controller.js";

export const router = Router();

const controller = new CategoryController();

router.get("/", (req: Request, res: Response) => {
  controller.getAllCategories(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  controller.getCategoryById(req, res);
});

router.post("/", (req: Request, res: Response) => {
  controller.addCategory(req, res);
});

router.patch("/:id", (req: Request, res: Response) => {
  controller.updateCategory(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
   controller.deleteCategory(req, res); 
});