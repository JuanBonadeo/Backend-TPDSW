
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