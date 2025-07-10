import { Movie } from "@prisma/client"
import z from "zod"

export interface CreateMovieDto {
  title: string
  description?: string
  duration?: number
  release_date?: number //year
  rating?: number
  id_category: number
  id_director: number,
  id_movie?: number
}

export interface movieList {
  currentPage: number,
  totalPages: number,
  movies: Movie[]
}
export interface MovieFilters {
  categoryId?: number,
  directorId?: number,
  actorId?: number
}
export const movieZodSchema = z.object({
        title: z.string().min(1, "El título es obligatorio").max(100, "El título no puede exceder los 100 caracteres"),
        description: z.string().optional(),
        duration: z.coerce.number().int().positive("La duración debe ser un número entero positivo").optional(),
        release_date: z.coerce.number().int().positive("Fecha de lanzamiento inválida").min(1810).max(new Date().getFullYear()).optional(),
        rating: z.coerce.number().min(0, "La calificación debe ser al menos 0").max(5, "La calificación no puede exceder 5").optional(),
        id_category: z.number().int().positive("ID de categoría inválido"),
        id_director: z.number().int().positive("ID de director inválido"),
});

export const movieZodSchemaUpdate = z.object({
  title: z.string().min(1, "El título es obligatorio").max(100, "El título no puede exceder los 100 caracteres").optional(),
  description: z.string().optional(),
  duration: z.coerce.number().int().positive("La duración debe ser un número entero positivo").optional(),
  release_date: z.coerce.number().int().positive("Fecha de lanzamiento inválida").min(1810).max(new Date().getFullYear()).optional(),
  rating: z.coerce.number().min(0, "La calificación debe ser al menos 0").max(5, "La calificación no puede exceder 5").optional(),
  id_category: z.number().int().positive("ID de categoría inválido"),
  id_director: z.number().int().positive("ID de director inválido"),
  id_movie: z.number().int().positive("ID de película inválido"),
});

export const movieZodSchemaQuery = z.object({
  page: z.coerce.number().int().positive("El número de página debe ser un entero positivo").default(1),
  limit: z.coerce.number().int().positive("El límite debe ser un entero positivo").default(10),
  categoryId: z.coerce.number().int().optional(),
  directorId: z.coerce.number().int().optional(),
  actorId: z.coerce.number().int().optional(),
});