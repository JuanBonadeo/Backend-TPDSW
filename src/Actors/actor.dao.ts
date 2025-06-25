import prisma from "../db/db.js";
import { Actor } from "@prisma/client";
import { CreateActorDto } from "./actor.interface.js";



export class ActorDAO {


  async getAll(): Promise<Actor[] | null>{
    const categories = await prisma.actor.findMany();
    return categories

    
  }

  async getById(id: number): Promise<Actor | null> {
    const actor = await prisma.actor.findUnique({
      where: { id_actor: id } 
    })
    return actor
  }

  async add(actor: CreateActorDto): Promise<Actor | null>{
    const newActor = await prisma.actor.create({
      data: {
        first_name: actor.first_name,
        last_name: actor.last_name,
      }
    })
    return newActor
  }

  async update(id: number, updatedActor: Actor): Promise<Actor | null>  {
    const result = await prisma.actor.update({
      where: { id_actor: id },
      data: {
        first_name: updatedActor.first_name,
        last_name: updatedActor.last_name
      }
    })
    return result
    
  }

  async delete(id: number): Promise< Actor > {
    const result = await prisma.actor.delete({
      where: {id_actor: id}
    })
    return result
  }
  
}