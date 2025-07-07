import z from "zod"

export interface CreateMovieDto {
  title: string
  description?: string
  duration?: number
  release_date?: number //year
  rating?: number
  id_category: number
  id_director: number
}


export const movieZodSchema = z.object({
        title: z.string().min(1, "El título es obligatorio").max(100, "El título no puede exceder los 100 caracteres"),
        description: z.string().optional(),
        duration: z.coerce.number().int().positive("La duración debe ser un número entero positivo").optional(),
        release_date: z.coerce.number().int().positive("Fecha de lanzamiento inválida").min(1810).max(new Date().getFullYear()),
        rating: z.coerce.number().min(0, "La calificación debe ser al menos 0").max(5, "La calificación no puede exceder 5").optional(),
        id_category: z.number().int().positive("ID de categoría inválido"),
        id_director: z.number().int().positive("ID de director inválido"),

});