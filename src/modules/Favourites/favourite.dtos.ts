import z from 'zod';

export const idParamsSchema = z
    .string()
    .transform((val: string) => parseInt(val))
    .pipe(z.number().int().positive('El ID debe ser un número positivo'));

export const idUserParamsSchema = z
    .string()
    .min(1, 'El ID de usuario es obligatorio');

// Schema actualizado para favoritos
export const favouriteZodSchema = z.object({
    id_movie: z.number().int().positive('El ID de película debe ser un número positivo'),
});

// Schema para toggle (solo necesita id_movie, el id_user viene del token)
export const toggleFavouriteSchema = z.object({
    id_movie: z.number().int().positive('El ID de película debe ser un número positivo'),
});

export type CreateFavouriteDto = z.infer<typeof favouriteZodSchema>;
export type ToggleFavouriteDto = z.infer<typeof toggleFavouriteSchema>;
export type FavouriteParams = z.infer<typeof idParamsSchema>;
export type UserParams = z.infer<typeof idUserParamsSchema>;