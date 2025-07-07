import z from "zod";

// movie-actor.interface.ts
export interface CreateMovieActorDto {
    id_movie: number;
    id_actor: number;
    role: Role;
}

export interface MovieActorResponse {
    id_movie: number;
    id_actor: number;
    role?: Role;
    created_at?: Date;
    // Relaciones populadas
    Movie?: {
        id_movie: number;
        title: string;
    };
    Actor?: {
        id_actor: number;
        first_name: string;
        last_name: string;
    };
}
export enum Role {
    PROTAGONIST = "Protagonist",
    SECCONDARY = "Secondary",
    EXTRA = "Extra",
}

export const movieActorZodSchema = z.object({
    id_movie: z.number().int().positive("ID de película inválido"),
    id_actor: z.number().int().positive("ID de actor inválido"),
    role: z.nativeEnum(Role, {
        errorMap: (issue, ctx) => {
            return { message: `Rol inválido. Valores permitidos: ${Object.values(Role).join(", ")}` };
        },
    }),
});

