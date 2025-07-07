import z from "zod"

export interface CreateActorDto {
  first_name: string,
  last_name: string
  id_actor?: number // Optional for creation, required for updates
}

export const actorZodSchema = z.object({
  first_name: z.string().min(1, "El nombre es obligatorio").max(50, "El nombre no puede exceder los 50 caracteres"),
  last_name: z.string().min(1, "El apellido es obligatorio").max(50, "El apellido no puede exceder los 50 caracteres"),
  
})