import { Movie } from '@prisma/client';
import z from 'zod';

export const idParamsSchema = z
.string()
.transform((val: string) => parseInt(val))
.pipe(z.number().int().positive('El ID debe ser un número positivo'))
.describe('ID del ejercicio');

export const movieZodSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio').max(100, 'El título no puede exceder los 100 caracteres'),
    description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres'),
    duration: z.coerce.number().int().positive('La duración debe ser un número entero positivo'),
    release_date: z.coerce.number().int().positive('Fecha de lanzamiento inválida').min(1810).max(new Date().getFullYear()),
    rating: z.coerce.number().min(0, 'La calificación debe ser al menos 0').max(5, 'La calificación no puede exceder 5'),
    
    id_category: idParamsSchema,
    id_director: idParamsSchema,
    
    tmdb_id: z.number().optional(),
    poster_path: z.string().max(500, 'La ruta del póster no puede exceder los 500 caracteres').optional(),
    backdrop_path: z.string().max(500, 'La ruta del fondo no puede exceder los 500 caracteres').optional(),
    original_language: z.string().max(10, 'El idioma original no puede exceder los 10 caracteres').optional(),
    adult: z.coerce.boolean().optional(),
    vote_count: z.coerce.number().int().positive('El conteo de votos debe ser un número entero positivo').optional(),
    popularity: z.coerce.number().optional()
});

export const updateMovieZodSchema = movieZodSchema.partial();

export const movieZodSchemaQuery = z.object({
    page: z.coerce.number().int().positive('El número de página debe ser un entero positivo').default(1),
    limit: z.coerce.number().int().positive('El límite debe ser un entero positivo').default(10),
    categoryId: z.coerce.number().int().optional(),
    directorId: z.coerce.number().int().optional(),
    actorId: z.coerce.number().int().optional(),
});

export type CreateMovieDto = z.infer<typeof movieZodSchema>;
export type UpdateMovieDto = z.infer<typeof updateMovieZodSchema>;
export type MovieQueryDto = z.infer<typeof movieZodSchemaQuery>;
export type MovieParams = z.infer<typeof idParamsSchema>;


export interface movieList {
    currentPage: number;
    totalPages: number;
    movies: Movie[];
}
export interface MovieFilters {
    categoryId?: number;
    directorId?: number;
    actorId?: number;
}