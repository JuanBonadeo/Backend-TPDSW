import z from "zod"
import { id } from "zod/v4/locales"

export interface CreateDirectorDto {
  first_name: string
  last_name: string
  nationality?: string
}

export const directorZodSchema = z.object({
  first_name: z.string().min(1, "El nombre es obligatorio").max(50, "El nombre no puede exceder los 50 caracteres"),
  last_name: z.string().min(1, "El apellido es obligatorio").max(50, "El apellido no puede exceder los 50 caracteres"),
  nationality: z.string().optional(),
  id: z.coerce.number().int().positive("ID de director inválido").optional()
}).strict()
  