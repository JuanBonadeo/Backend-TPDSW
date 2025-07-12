import z from "zod";

export interface FavouriteDTO {
    id_user: string;
    id_movie: number;
}

export const favouriteZodSchema = z.object({
    id_user: z.string().min(1, "El ID de usuario es requerido"),
    id_movie: z.number().int().positive(),
});