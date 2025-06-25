// Agregar validacion de parametros
import { Actor } from "@prisma/client";
import { ActorDAO } from "./actor.dao.js";
import { Request, Response } from "express";
import { CreateActorDto } from "./actor.interface.js";

// import { z } from "zod";


export class ActorController {
  private dao: ActorDAO;

  constructor() {
    this.dao = new ActorDAO();
  }

  async getAllActors(req: Request, res: Response) {
    try {
      const result = await this.dao.getAll();
      if (!result || result.length === 0) {
        return res.status(404).send({ error: "No se encontraron actores" });
      }
      res.send({ result });
    } catch (error) {
      console.error("Error al obtener los actores:", error);
      res.status(500).send({ error: "Error al obtener los actores" });
    }
  }

  async getActorById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const result = await this.dao.getById(id);

      if (!result) {
        res.status(404).send({ error: "Actor no encontrado" });
      } else {
        res.send({ result });
      }
    } catch (error) {
      console.error("Error al obtener el actor:", error);
      res.status(500).send({ error: "Error al obtener el actor" });
    }
  }

  async addActor(req: Request, res: Response) {
    const newActor = req.body as CreateActorDto;
    if (!newActor || !newActor.first_name || !newActor.last_name) {
      return res.status(400).send({ error: "Datos de actor incompletos" });
    }
    try {
      const result = await this.dao.add(newActor);
      if (!result) {
        return res.status(400).send({ error: "Error al agregar el actor" });
      }
      res.status(201).send({ result });
    } catch (error) {
      console.error("Error al agregar el actor:", error);
      res.status(500).send({ error: "Error al agregar el actor" });
    }
  }

  async updateActor(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updatedData = req.body as Actor;
    try {
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res
          .status(400)
          .send({ error: "No se enviaron datos para actualizar" });
      }

      const existingActor = await this.dao.getById(id);
      if (!existingActor) {
        return res.status(404).send({ error: "Actor no encontrado" });
      }
      const result = await this.dao.update(id, updatedData);
      if (!result) {
        return res.status(404).send({ error: "Actor no encontrado" });
      }
      res.send({ result, message: "Actor actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el actor:", error);
      res.status(500).send({ error: "Error al actualizar el actor" });
    }
  }

  async deleteActor(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const existingActor = await this.dao.getById(id);
      if (!existingActor) {
        return res.status(404).send({ error: "Actor no encontrado" });
      }
      const result = await this.dao.delete(id);
      if (!result) {
        return res.status(400).send({ error: "Error al eliminar el actor" });
      }
      res.send({ message: "Actor eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el actor:", error);
      res.status(500).send({ error: "Error al eliminar el actor" });
    }
  }



}