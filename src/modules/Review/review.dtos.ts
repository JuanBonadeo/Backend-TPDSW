import { z } from 'zod';

export const idParamsSchema = z
.string()
.transform((val: string) => parseInt(val))
.pipe(z.number().int().positive('El ID debe ser un número positivo'))
.describe('ID del ejercicio');

export const idUserParamsSchema = z
    .string()
    .pipe(z.string().min(1, 'El ID de usuario es obligatorio'))
    .describe('ID del usuario');

export const reviewZodSchema = z.object({
    id_movie: idParamsSchema,
    score: z.number().refine(
        (val) => val >= 0 && val <= 5,
        {
            message: 'La puntuación debe estar entre 0 y 5',
        }
    ),
    comment: z.string().max(5000, 'El comentario no puede exceder los 1000 caracteres')
})

export const reviewUpdateZodSchema = reviewZodSchema.partial()

export type CreateReviewDto = z.infer<typeof reviewZodSchema>;
export type UpdateReviewDto = z.infer<typeof reviewUpdateZodSchema>;
export type IdParamsSchema = z.infer<typeof idParamsSchema>;

export interface ReviewData {
    id_user: string;
    id_movie: number;
    score: number;
    comment: string;
}