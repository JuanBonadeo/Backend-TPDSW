import z from 'zod';
import { id } from 'zod/v4/locales';

export const idParamsSchema = z
    .string()
    .transform((val: string) => parseInt(val))
    .pipe(z.number().int().positive('El ID debe ser un número positivo'))
    .describe('ID del ejercicio');

export const movieActorZodSchema = z.object({
    id_movie: idParamsSchema,
    id_actor: idParamsSchema,
    role: z.string().min(1, 'El rol es obligatorio').max(50, 'El rol no puede exceder los 50 caracteres'),
    character: z.string().min(1, 'El personaje es obligatorio').max(100, 'El personaje no puede exceder los 100 caracteres'),
    order: z.number().min(1, 'El orden debe ser un número positivo').max(5, 'El orden no puede exceder 5')
}).describe('Esquema para la relación Película-Actor');

export const movieActorUpdateZodSchema = z.object({
    role: z.string().min(1, 'El rol es obligatorio').max(50, 'El rol no puede exceder los 50 caracteres').optional(),
    character: z.string().min(1, 'El personaje es obligatorio').max(100, 'El personaje no puede exceder los 100 caracteres').optional(),
    order: z.number().min(1, 'El orden debe ser un número positivo').max(5, 'El orden no puede exceder 5').optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
}).describe('Esquema de actualización para la relación Película-Actor');

export type CreateMovieActorDto = z.infer<typeof movieActorZodSchema>;
export type UpdateMovieActorDto = z.infer<typeof movieActorUpdateZodSchema>;
export type MovieActorParams = z.infer<typeof idParamsSchema>;