// Agregar validacion de parametros
import { Category } from "@prisma/client";
import { CategoryDAO } from "./category.dao.js";
import { Request, Response } from "express";
import { CreateCategoryDto } from "./category.interface.js";

// import { z } from "zod";


export class CategoryController {
  private dao: CategoryDAO;

  constructor() {
    this.dao = new CategoryDAO();
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const result = await this.dao.getAll();
      if (!result || result.length === 0) {
        return res.status(404).send({ error: "No se encontraron categorias" });
      }
      res.send({ result });
    } catch (error) {
      console.error("Error al obtener las categorias:", error);
      res.status(500).send({ error: "Error al obtener las categorias" });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const result = await this.dao.getById(id);

      if (!result) {
        res.status(404).send({ error: "Categoria no encontrada" });
      } else {
        res.send({ result });
      }
    } catch (error) {
      console.error("Error al obtener la categoria:", error);
      res.status(500).send({ error: "Error al obtener la categoria" });
    }
  }

  async addCategory(req: Request, res: Response) {
    const newCategory = req.body as CreateCategoryDto;
    if (!newCategory || !newCategory.name) {
      return res.status(400).send({ error: "Datos de categoria incompletos" });
    }
    try {
      const result = await this.dao.add(newCategory);
      if (!result) {
        return res.status(400).send({ error: "Error al agregar la categoria" });
      }
      res.status(201).send({ result });
    } catch (error) {
      console.error("Error al agregar la categoria:", error);
      res.status(500).send({ error: "Error al agregar la categoria" });
    }
  }

  async updateCategory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updatedData = req.body as Category;
    try {
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res
          .status(400)
          .send({ error: "No se enviaron datos para actualizar" });
      }

      const existingCategory = await this.dao.getById(id);
      if (!existingCategory) {
        return res.status(404).send({ error: "Categoria no encontrada" });
      }
      const result = await this.dao.update(id, updatedData);
      if (!result) {
        return res.status(404).send({ error: "Categoria no encontrada" });
      }
      res.send({ result, message: "Categoria actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
      res.status(500).send({ error: "Error al actualizar la categoria" });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const existingCategory = await this.dao.getById(id);
      if (!existingCategory) {
        return res.status(404).send({ error: "Categoria no encontrada" });
      }
      const result = await this.dao.delete(id);
      if (!result) {
        return res.status(400).send({ error: "Error al eliminar la categoria" });
      }
      res.send({ message: "Categoria eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la categoria:", error);
      res.status(500).send({ error: "Error al eliminar la categoria" });
    }
  }



}