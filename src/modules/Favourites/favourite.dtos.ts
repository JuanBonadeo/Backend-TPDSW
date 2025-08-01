import z from 'zod';
import { id } from 'zod/v4/locales';

export const idParamsSchema = z
    .string()
    .transform((val: string) => parseInt(val))
    .pipe(z.number().int().positive('El ID debe ser un número positivo'))
    .describe('ID ');

export const idUserParamsSchema = z
    .string()
    .pipe(z.string().min(1, 'El ID de usuario es obligatorio'))
    .transform((val: string) => val.trim())
    .describe('ID del usuario');

export const favouriteZodSchema = z.object({
    id_user: idUserParamsSchema,
    id_movie: idParamsSchema
});



export type FavouriteDto = z.infer<typeof favouriteZodSchema>;
export type FavouriteParams = z.infer<typeof idParamsSchema>;
export type FavouriteUserParams = z.infer<typeof idUserParamsSchema>;