import z from 'zod';

export interface CreateCategoryDto {
    name: string;
    description?: string;
}

export const categoryZodSchema = z
    .object({
        name: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no puede exceder los 50 caracteres'),
        description: z.string().optional(),
        id: z.coerce.number().int().positive('ID de categoria inválido').optional(),
    })
    .strict();
