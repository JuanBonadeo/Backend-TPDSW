// Agregar validacion de parametros
import { Director } from "@prisma/client";
import { DirectorDAO } from "./director.dao.js";
import { Request, Response } from "express";
import { CreateDirectorDto } from "./director.interface.js";

// import { z } from "zod";


export class DirectorController {
  private dao: DirectorDAO;

  constructor() {
    this.dao = new DirectorDAO();
  }

  async getAllDirectors(req: Request, res: Response) {
    try {
      const result = await this.dao.getAll();
      if (!result || result.length === 0) {
        return res.status(404).send({ error: "No se encontraron directores" });
      }
      res.send({ result });
    } catch (error) {
      console.error("Error al obtener los directores:", error);
      res.status(500).send({ error: "Error al obtener los directores" });
    }
  }

  async getDirectorById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const result = await this.dao.getById(id);

      if (!result) {
        res.status(404).send({ error: "Director no encontrado" });
      } else {
        res.send({ result });
      }
    } catch (error) {
      console.error("Error al obtener el director:", error);
      res.status(500).send({ error: "Error al obtener el director" });
    }
  }

  async addDirector(req: Request, res: Response) {
    const newDirector = req.body as CreateDirectorDto;
    if (!newDirector || !newDirector.first_name || !newDirector.last_name) {
      return res.status(400).send({ error: "Datos del director incompletos" });
    }
    try {
      const result = await this.dao.add(newDirector);
      if (!result) {
        return res.status(400).send({ error: "Error al agregar el director" });
      }
      res.status(201).send({ result });
    } catch (error) {
      console.error("Error al agregar al director:", error);
      res.status(500).send({ error: "Error al agregar el director" });
    }
  }

  async updateDirector(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updatedData = req.body as Director;
    try {
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res
          .status(400)
          .send({ error: "No se enviaron datos para actualizar" });
      }

      const existingDirector = await this.dao.getById(id);
      if (!existingDirector) {
        return res.status(404).send({ error: "Director no encontrado" });
      }
      const result = await this.dao.update(id, updatedData);
      if (!result) {
        return res.status(404).send({ error: "Director no encontrado" });
      }
      res.send({ result, message: "Director actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el director:", error);
      res.status(500).send({ error: "Error al actualizar el director" });
    }
  }

  async deleteDirector(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const existingDirector = await this.dao.getById(id);
      if (!existingDirector) {
        return res.status(404).send({ error: "Director no encontrado" });
      }
      const result = await this.dao.delete(id);
      if (!result) {
        return res.status(400).send({ error: "Error al eliminar al director" });
      }
      res.send({ message: "Director eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el director:", error);
      res.status(500).send({ error: "Error al eliminar el director" });
    }
  }



}