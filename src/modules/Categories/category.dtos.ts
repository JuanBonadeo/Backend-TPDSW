import z from 'zod';


export const idParamsSchema = z
    .string()
    .transform((val: string) => parseInt(val))
    .pipe(z.number().int().positive('El ID debe ser un número positivo'))
    .describe('ID del ejercicio');

export const categoryZodSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no puede exceder los 50 caracteres'),
    description: z.string().max(200, 'La descripción no puede exceder los 200 caracteres').optional(),
    tmdb_id: z.number().int().positive('El ID de TMDB debe ser un número positivo').optional(),
});

export const updateCategoryZodSchema = categoryZodSchema.partial();

export type CreateCategoryDto = z.infer<typeof categoryZodSchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategoryZodSchema>;
export type CategoryParams = z.infer<typeof idParamsSchema>;