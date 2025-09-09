import z from 'zod';

export const idParamsSchema = z
    .string()
    .transform((val: string) => parseInt(val))
    .pipe(z.number().int().positive('El ID debe ser un número positivo'));

export const idUserParamsSchema = z
    .string()
    .min(1, 'El ID de usuario es obligatorio');

// Schema actualizado para favoritos
export const toWatchZodSchema = z.object({
    id_movie: z.number().int().positive('El ID de película debe ser un número positivo'),
});

// Schema para toggle (solo necesita id_movie, el id_user viene del token)
export const toggleToWatchSchema = z.object({
    id_movie: z.number().int().positive('El ID de película debe ser un número positivo'),
});

export type CreateToWatchDto = z.infer<typeof toWatchZodSchema>;
export type ToggleToWatchDto = z.infer<typeof toggleToWatchSchema>;
export type ToWatchParams = z.infer<typeof idParamsSchema>;
export type UserParams = z.infer<typeof idUserParamsSchema>;
